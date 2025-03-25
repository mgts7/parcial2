import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SponsorsService } from './sponsors.service';
import { SponsorsController } from './sponsors.controller';
import { Sponsors } from './entities/sponsor.entity';
import { Contestant } from '../contestants/entities/contestant.entity'; // Importar Contestant

@Module({
  imports: [TypeOrmModule.forFeature([Sponsors, Contestant])], // Agregar Contestant
  providers: [SponsorsService],
  controllers: [SponsorsController],
  exports: [SponsorsService],
})
export class SponsorsModule {}
