import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dictator } from './entities/dictator.entity';
import { CreateDictatorDto } from './dto/create-dictator.dto';
import { UpdateDictatorDto } from './dto/update-dictator.dto';

@Injectable()
export class DictatorsService {
  constructor(
    @InjectRepository(Dictator)
    private readonly dictatorRepository: Repository<Dictator>,
  ) {}

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
