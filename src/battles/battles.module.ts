import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BattlesService } from './battles.service';
import { BattlesController } from './battles.controller';
import { Battles } from './entities/battle.entity';
import { Contestant } from '../contestants/entities/contestant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Battles, Contestant])], // Importa Battle como entidad
  providers: [BattlesService],
  controllers: [BattlesController],
  exports: [BattlesService],
})
export class BattlesModule {}
