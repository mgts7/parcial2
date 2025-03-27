import { Injectable, NotFoundException } from '@nestjs/common';
import { Contestant } from '../contestants/entities/contestant.entity';
import { Dictator } from 'src/dictators/entities/dictator.entity';
import * as readlineSync from 'readline-sync';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { CreateBattleDto } from './dto/create-battle.dto';
import { Battles } from './entities/battle.entity';
import { UpdateBattleDto } from './dto/update-battle.dto';
import * as crypto from 'crypto';

@Injectable()

export class BattlesService {
  constructor(
    @InjectRepository(Battles)
    private readonly battleRepository: Repository<Battles>,
  
  @InjectRepository(Contestant)
    private readonly contestantRepository: Repository<Contestant>
  ) {
    // this.initializeContestants().then(() => this.generateBattles());
  }

  async initializeContestants() {
    this.contestants = await this.contestantRepository.find();
    console.log("📋 Concursantes:", this.contestants.map(c => ({
      nickname: c.nickname,
      strength: c.strength,
      agility: c.agility,
      health: c.health
    })));
  }

  async create(createBattleDto: CreateBattleDto): Promise<Battles> {
    const battle = this.battleRepository.create(createBattleDto as DeepPartial<Battles>);
    return this.battleRepository.save(battle);
  }
  
  async getAllBattles() {
    return await this.battleRepository.find();
  }

  async getBattleById(id: string) {
    return await this.battleRepository.findOne({ where: { id } });
  }

  async getBattlesWithIndex() {
    const battles = await this.battleRepository.find({
      relations: ['contestant1', 'contestant2', 'winner'],
    });
    return battles.map((battle, index) => ({
      id: battle.id,  // Incluimos el id
      index: index + 1, // Empieza en 1
      contestant1: battle.contestant1,
      contestant2: battle.contestant2,
      winner: battle.winner ? battle.winner.nickname : '❓ Pendiente',
      status: battle.winner ? '✅ Finalizada' : '⌛ En curso'
    }));
  }
  
  
  async getBattleByIndex(index: number) {
    console.log(`🔍 Buscando batalla con índice ${index}`);
    const battles = await this.getBattlesWithIndex();
    return battles.find(battle => battle.index === index);
  }
  
  async startBattleWithUpdate(fight, simulate) {
    if (!fight || !fight.contestant1 || !fight.contestant2) {
      console.error("❌ Error: La batalla no tiene concursantes válidos.");
      return;
    }
  
    const result = await this.startBattle(fight, simulate);
    
    if (!result) {
      console.error("❌ Error al ejecutar la batalla.");
      return;
    }
  
    // Actualizar el torneo eliminando al perdedor
    const { winner, loser } = result;
    await this.contestantRepository.delete({ id: loser.id });
  
    console.log(`🏆 Ganador: ${winner.nickname} | ☠️ Perdedor: ${loser.nickname}`);
  }
  


  async findAll(): Promise<Battles[]> {
    return this.battleRepository.find();
  }

  async findOne(id: string): Promise<Battles> {
    const battle = await this.battleRepository.findOne({ where: { id } });
    if (!battle) throw new NotFoundException('Battle not found');
    return battle;
  }

  async update(id: string, updateBattleDto: UpdateBattleDto): Promise<Battles> {
    const battle = await this.findOne(id);
    Object.assign(battle, updateBattleDto);
    return this.battleRepository.save(battle);
  }

  async remove(id: string): Promise<void> {
    const battle = await this.findOne(id);
    await this.battleRepository.remove(battle);
  }

  async getBattleResults(): Promise<{ id: string; winner: string; loser: string }[]> {
    const battles = await this.findAll();
    return battles.map((battle) => ({
      id: battle.id,
      winner: battle.winner.name,
      loser: battle.loser.name,
    }));
  }
  async generateBattles() {
    if (this.contestants.length < 2) {
      console.log("❌ No hay suficientes concursantes para generar batallas.");
      return;
    }
  
    // Vacía la colección de batallas internas
    this.battles = [];
    let shuffledContestants = [...this.contestants].sort(() => Math.random() - 0.5);
    
    // Para cada pareja de concursantes, crea un objeto battle
    for (let i = 0; i < shuffledContestants.length; i += 2) {
      if (i + 1 < shuffledContestants.length) {
        const contestant1 = shuffledContestants[i];
        const contestant2 = shuffledContestants[i + 1];
  
        if (!contestant1 || !contestant2) {
          console.error("❌ Error: Uno de los concursantes es inválido.");
          continue;
        }
  
        const newBattle: Battles = this.battleRepository.create({
          contestant1,
          contestant2,
          death_occurred: false,
          injuries: "",
        });
        
        
        // Guarda la batalla en la base de datos
        await this.battleRepository.save(newBattle);
        // También la guarda en la colección interna, si la necesitas para otro propósito
        this.battles.push({
          round: 1,
          fights: [{ contestant1: shuffledContestants[i], contestant2: shuffledContestants[i + 1] }],
        });
        
      }
    }
  
    console.log('\n📜 Estado actual del torneo:');
    this.battles.forEach((battle) => {
      const fightDescriptions = battle.fights.map(fight =>
        `${fight.contestant1.nickname} VS ${fight.contestant2.nickname}`
      ).join(', ');
      console.log(`Round ${battle.round}, Fights: ${fightDescriptions}`);
    });
  }
  

  private contestants: Contestant[] = [];
  private battles: { round: number; fights: { contestant1: Contestant; contestant2: Contestant }[] }[] = [];
  private dictators: Dictator[] = [];
  private bets: { dictator: Dictator; contestant: Contestant; amount: number }[] = [];

  async promptRegisterDictator() {
    const name = readlineSync.question('Ingrese su nombre: ');
    const territory = readlineSync.question('Ingrese su territorio: ');
    const plata = readlineSync.questionInt('Ingrese la cantidad de plata: ');
    const numberOfSlaves = readlineSync.questionInt('Ingrese el numero de esclavos: ');
    const loyaltyToCarolina = readlineSync.questionInt('Ingrese la lealtad a Carolina (0-100): ');

    const dictator: Dictator = {
      id: crypto.randomUUID(),
      name,
      territory,
      plata,
      number_of_slaves: numberOfSlaves,
      loyalty_to_Carolina: loyaltyToCarolina,
    };

    this.registerDictator(dictator);
  }

  registerDictator(dictator: Dictator) {
    this.dictators.push(dictator);
    console.log(`✅ Dictador registrado: ${dictator.name}, Territorio: ${dictator.territory}, Plata: ${dictator.plata}`);
  }

  placeBet(dictator: Dictator, fight: { contestant1: Contestant; contestant2: Contestant }) {
    console.log(`📢 ${dictator.name}, debes apostar por uno de los dos combatientes.`);
    console.log(`1. ${fight.contestant1.nickname}`);
    console.log(`2. ${fight.contestant2.nickname}`);
    
    const choice = readlineSync.questionInt('Elige a quien apostar (1 o 2): ');
    const contestant = choice === 1 ? fight.contestant1 : fight.contestant2;
    
    const amount = readlineSync.questionInt(`💰 Cuanta plata deseas apostar por ${contestant.nickname}?: `);
    if (dictator.plata < amount) {
      console.log(`❌ ${dictator.name} no tiene suficiente plata para apostar ${amount}.`);
      return;
    }
    dictator.plata -= amount;
    this.bets.push({ dictator, contestant, amount });
    console.log(`💰 ${dictator.name} apuesta ${amount} por ${contestant.nickname}. Saldo actual: ${dictator.plata}`);
  }

  startBattle(fight: { contestant1: Contestant; contestant2: Contestant }, simulate: boolean): { winner: Contestant; loser: Contestant } {
    let { contestant1, contestant2 } = fight;
  
    if (!contestant1 || !contestant2) {
      throw new Error("❌ Error: No se encontraron los concursantes para la batalla.");
    }
  
    console.log(`🔥 Próxima batalla: ${contestant1.nickname} vs ${contestant2.nickname} 🔥`);
    
    this.dictators.forEach(dictator => {
      this.placeBet(dictator, fight);
    });
  
    let attacker = contestant1.agility >= contestant2.agility ? contestant1 : contestant2;
    let defender = attacker === contestant1 ? contestant2 : contestant1;
  
    console.log(`👉 ${attacker.nickname} ataca primero por mayor agilidad.`);
  
    while (contestant1.health > 0 && contestant2.health > 0) {
      console.log(`⚔️ Turno de ${attacker.nickname}`);
      let damage = attacker.strength;
      defender.health -= damage;
      console.log(`💥 ${attacker.nickname} ataca a ${defender.nickname} causando ${damage} de daño.`);
      console.log(`❤️ ${contestant1.nickname}: ${contestant1.health} HP, ${contestant2.nickname}: ${contestant2.health} HP`);
  
      if (defender.health <= 0) break;
      [attacker, defender] = [defender, attacker];
    }
  
    let winner = contestant1.health > 0 ? contestant1 : contestant2;
    let loser = winner === contestant1 ? contestant2 : contestant1;
  
    console.log(`🏆 El ganador es ${winner.nickname}!`);
    this.resolveBets(winner);
    console.log(`🎖️ Estado final: ${winner.nickname} tiene ${winner.health} HP restantes.`);
  
    return { winner, loser };
  }
  private resolveBets(winner: Contestant) {
    this.bets.forEach((bet) => {
      if (bet.contestant === winner) {
        let winnings = bet.amount * 2;
        bet.dictator.plata += winnings;
        console.log(`🎉 ${bet.dictator.name} gana la apuesta y obtiene ${winnings}! Saldo actual: ${bet.dictator.plata}`);
      } else {
        console.log(`❌ ${bet.dictator.name} pierde la apuesta de ${bet.amount}. Saldo actual: ${bet.dictator.plata}`);
      }
    });
    this.bets = [];
  }
}
