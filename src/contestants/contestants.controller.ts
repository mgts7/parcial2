import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { ContestantsService } from './contestants.service';
import { CreateContestantDto } from './dto/create-contestant.dto';
import { UpdateContestantDto } from './dto/update-contestant.dto';

@Controller('contestants')
export class ContestantsController {
  constructor(private readonly contestantsService: ContestantsService) {}

  @Post()
  create(@Body() createContestantDto: CreateContestantDto) {
    return this.contestantsService.create(createContestantDto);
  }

  @Get()
  findAll() {
    return this.contestantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contestantsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContestantDto: UpdateContestantDto) {
    return this.contestantsService.update(id, updateContestantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contestantsService.remove(id);
  }

  @Get('/ranking')
  getRanking() {
    return this.contestantsService.getRanking();
  }
}
