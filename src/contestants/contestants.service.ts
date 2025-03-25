import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contestant } from './entities/contestant.entity';
import { CreateContestantDto } from './dto/create-contestant.dto';
import { UpdateContestantDto } from './dto/update-contestant.dto';

@Injectable()
export class ContestantsService {
  constructor(
    @InjectRepository(Contestant)
    private readonly contestantRepository: Repository<Contestant>,
  ) {}

  async create(createContestantDto: CreateContestantDto): Promise<Contestant> {
    const contestant = this.contestantRepository.create(createContestantDto);
    return this.contestantRepository.save(contestant);
  }

  async findAll(): Promise<Contestant[]> {
    return this.contestantRepository.find();
  }

  async findOne(id: string): Promise<Contestant> {
    const contestant = await this.contestantRepository.findOne({ where: { id } });
    if (!contestant) throw new NotFoundException('Contestant not found');
    return contestant;
  }

  async update(id: string, updateContestantDto: UpdateContestantDto): Promise<Contestant> {
    const contestant = await this.findOne(id);
    Object.assign(contestant, updateContestantDto);
    return this.contestantRepository.save(contestant);
  }

  async remove(id: string): Promise<void> {
    const contestant = await this.findOne(id);
    await this.contestantRepository.remove(contestant);
  }

  async getRanking(): Promise<{ name: string; rank: string }[]> {
    const contestants = await this.findAll();
    return contestants.map((contestant) => {
      let rank = 'Coward'; // 0 victorias
      if (contestant.wins > 2) rank = 'Novice Warrior'; // 3-5 victorias
      if (contestant.wins > 5) rank = 'Mediocre Fighter'; // 6-10 victorias
      if (contestant.wins > 10) rank = 'Killing Machine'; // 11-15 victorias
      if (contestant.wins > 15) rank = 'Bloodthirsty Champion'; // 16-20 victorias
      if (contestant.wins > 20) rank = 'Legendary Gladiator'; // 21-30 victorias
      if (contestant.wins > 30) rank = 'God of the Arena'; // 31+ victorias
  
      return { name: contestant.name, rank };
    });
  }
}
