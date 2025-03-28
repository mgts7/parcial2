import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dictator } from './entities/dictator.entity';
import { CreateDictatorDto } from './dto/create-dictator.dto';
import { UpdateDictatorDto } from './dto/update-dictator.dto';
import * as readlineSync from 'readline-sync';
import * as crypto from 'crypto';

@Injectable()
export class DictatorsService {
  constructor(
    @InjectRepository(Dictator)
    private readonly dictatorRepository: Repository<Dictator>,
  ) {}
  private dictators: Dictator[] = [];

  
  async promptRegisterDictator(): Promise<Dictator | null> {
    try {
      const name = readlineSync.question('Ingrese su nombre: ');
      const territory = readlineSync.question('Ingrese su territorio: ');
      const plata = readlineSync.questionInt('Ingrese la cantidad de plata: ');
      const numberOfSlaves = readlineSync.questionInt('Ingrese el número de esclavos: ');
      const loyaltyToCarolina = readlineSync.questionInt('Ingrese la lealtad a Carolina (0-100): ');

      const dictator = this.dictatorRepository.create({
        id: crypto.randomUUID(),
        name,
        territory,
        plata,
        number_of_slaves: numberOfSlaves,
        loyalty_to_Carolina: loyaltyToCarolina,
      });

      return await this.registerDictator(dictator);
    } catch (error) {
      console.error('Error al registrar dictador:', error);
      return null;
    }
  }

  async registerDictator(dictator: Dictator): Promise<Dictator> {
    try {
      const savedDictator = await this.dictatorRepository.save(dictator);
      console.log(`Dictador registrado: ${savedDictator.name}, Territorio: ${savedDictator.territory}, Plata: ${savedDictator.plata}`);
      return savedDictator;
    } catch (error) {
      console.error('Error al guardar en la base de datos:', error);
      throw error;
    }
  }

  create(createDictatorDto: CreateDictatorDto) {
    const dictator = this.dictatorRepository.create(createDictatorDto);
    return this.dictatorRepository.save(dictator);
  }

  findAll() {
    return this.dictatorRepository.find();
  }

  findOne(id: string) {
    return this.dictatorRepository.findOne({ where: { id } });
  }

  async update(id: string, updateDictatorDto: UpdateDictatorDto) {
    await this.dictatorRepository.update(id, updateDictatorDto);
    return this.findOne(id);
  }



  async remove(id: string) {
    const dictator = await this.findOne(id);
    if (dictator) {
      await this.dictatorRepository.remove(dictator);
      return { message: 'Dictator removed' };
    }
    return { message: 'Dictator not found' };
  }
}
