import { Repository } from 'typeorm';
import { BattlesService } from './src/battles/battles.service';
import { Contestant, ContestantStatus } from './src/contestants/entities/contestant.entity';
import { Battles } from 'src/battles/entities/battle.entity';
import * as readlineSync from 'readline-sync';


const mockBattleRepository: Partial<Repository<Battles>> = {
  find: async () => [], // Simula una respuesta vacía de find()
  save: async (entity) => Array.isArray(entity) ? entity : [entity],
};

// Mock del repositorio de concursantes
const mockContestantRepository: Partial<Repository<Contestant>> = {
  find: async () => [], // Simula una respuesta vacía de find()
  save: async (entity) => Array.isArray(entity) ? entity : [entity],
};

// Crea la instancia de BattlesService con los mocks
const battleService = new BattlesService(
  mockBattleRepository as Repository<Battles>,
  mockContestantRepository as Repository<Contestant>,
);

// Registrar al dictador antes de cualquier acción
battleService.promptRegisterDictator();

const contestants: Contestant[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Esclavo 1',
    nickname: 'JUANCHI',
    origin: 'Región X',
    strength: 50,
    agility: 60,
    health: 100,
    wins: 0,
    losses: 0,
    status: ContestantStatus.ALIVE,
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Esclavo 2',
    nickname: 'TORO',
    origin: 'Región Y',
    strength: 55,
    agility: 55,
    health: 95,
    wins: 0,
    losses: 0,
    status: ContestantStatus.ALIVE,
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Esclavo 3',
    nickname: 'LEÓN',
    origin: 'Región Z',
    strength: 60,
    agility: 50,
    health: 90,
    wins: 0,
    losses: 0,
    status: ContestantStatus.ALIVE,
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'Esclavo 4',
    nickname: 'FUEGO',
    origin: 'Región A',
    strength: 48,
    agility: 65,
    health: 105,
    wins: 0,
    losses: 0,
    status: ContestantStatus.ALIVE,
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    name: 'Esclavo 5',
    nickname: 'ÁGIL',
    origin: 'Región B',
    strength: 52,
    agility: 70,
    health: 98,
    wins: 0,
    losses: 0,
    status: ContestantStatus.ALIVE,
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    name: 'Esclavo 6',
    nickname: 'ROCK',
    origin: 'Región C',
    strength: 65,
    agility: 45,
    health: 110,
    wins: 0,
    losses: 0,
    status: ContestantStatus.ALIVE,
  },
  {
    id: '77777777-7777-7777-7777-777777777777',
    name: 'Esclavo 7',
    nickname: 'TORMENTA',
    origin: 'Región D',
    strength: 58,
    agility: 62,
    health: 102,
    wins: 0,
    losses: 0,
    status: ContestantStatus.ALIVE,
  },
  {
    id: '88888888-8888-8888-8888-888888888888',
    name: 'Esclavo 8',
    nickname: 'VORTEX',
    origin: 'Región E',
    strength: 54,
    agility: 68,
    health: 97,
    wins: 0,
    losses: 0,
    status: ContestantStatus.ALIVE,
  },
];




async function mainMenu() {
  if (!battleService) {
    console.error("❌ battleService no ha sido inicializado.");
    return;
  }

  while (true) {
    console.log('\n1. 🔄 Ver estado del torneo');
    console.log('2. ⚔️ Iniciar la siguiente batalla');
    console.log('3. ❌ Salir');

    const choice = readlineSync.question('Selecciona una opcion: ');

    if (choice === '1') {
      const battles = await battleService.getBattlesWithIndex();
      console.log('\n📜 Estado actual del torneo:');
      battles.forEach(battle => 
        console.log(`${battle.index}. ${battle.contestant1} vs ${battle.contestant2} | ${battle.status} | 🏆 ${battle.winner}`)
      );
    } else if (choice === '2') {
      const pendingBattles = await battleService.getBattlesWithIndex();
      const nextBattle = pendingBattles.find(b => b.status === '⌛ En curso');
      
      if (nextBattle) {
        console.log(`\n⚔️ Iniciando batalla ${nextBattle.index}: ${nextBattle.contestant1} vs ${nextBattle.contestant2}`);
        await battleService.startBattleWithUpdate(nextBattle, false);
      } else {
        console.log('✅ No quedan batallas pendientes.');
      }
    } else if (choice === '3') {
      console.log('👋 Saliendo...');
      break;
    }
  }
}

// 🔥 Llamar a la función en un `async IIFE`
(async () => {
  await mainMenu();
})();