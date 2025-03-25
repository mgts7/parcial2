import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sponsors } from './entities/sponsor.entity';
import { CreateSponsorDto } from './dto/create-sponsor.dto';
import { UpdateSponsorDto } from './dto/update-sponsor.dto';
import { Contestant } from 'src/contestants/entities/contestant.entity';

@Injectable()
export class SponsorsService {
  constructor(
    @InjectRepository(Sponsors)
    private readonly sponsorRepository: Repository<Sponsors>,
    @InjectRepository(Contestant)
    private readonly contestantRepository: Repository<Contestant>
  ) {}

  async create(createSponsorDto: CreateSponsorDto): Promise<Sponsors> {
    const sponsor = this.sponsorRepository.create(createSponsorDto);
    return await this.sponsorRepository.save(sponsor);
  }

  async findAll(): Promise<Sponsors[]> {
    return await this.sponsorRepository.find();
  }

  async findOne(id: string): Promise<Sponsors | null> {
    const sponsor = await this.sponsorRepository.findOne({ where: { id } });
    if (!sponsor) {
      throw new NotFoundException(`Sponsor with ID ${id} not found`);
    }
    return sponsor;
  }

  async update(id: string, updateSponsorDto: UpdateSponsorDto): Promise<Sponsors> {
    await this.sponsorRepository.update(id, updateSponsorDto);
    const updatedSponsor = await this.sponsorRepository.findOne({ where: { id } });
  
    if (!updatedSponsor) {
      throw new NotFoundException(`Sponsor with id ${id} not found`);
    }
  
    return updatedSponsor;
  }
  

  async remove(id: string): Promise<void> {
    await this.sponsorRepository.delete(id);
  }

  async sponsorContestant(sponsorId: string, contestantId: string, items: string): Promise<string> {
    const sponsor = await this.sponsorRepository.findOne({ where: { id: sponsorId } });
    const contestant = await this.contestantRepository.findOne({ where: { id: contestantId } });
    
    if (!sponsor || !contestant) {
      throw new Error('Sponsor or contestant not found');
    }
    
    sponsor.donated_items = items;
    sponsor.preferred_fighter = contestantId;
    await this.sponsorRepository.save(sponsor);
    
    return `${sponsor.company_name} has sponsored ${contestant.nickname} with ${items}`;
  }
}
