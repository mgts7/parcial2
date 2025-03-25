import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DictatorsService } from './dictators.service';
import { DictatorsController } from './dictators.controller';
import { Dictator } from './entities/dictator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dictator])], // Importando el repositorio
  controllers: [DictatorsController],
  providers: [DictatorsService],
  exports: [DictatorsService], // Exportar si se usa en otros módulos
  
})
export class DictatorsModule {}
