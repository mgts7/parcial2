import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transactions } from 'src/transactions/entities/transaction.entity';  // 👈 Importa Transactions
import { Dictator } from '../dictators/entities/dictator.entity'; 
import { DictatorsModule } from '../dictators/dictators.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transactions, Dictator]), // 👈 Agrega Dictator aquí
    DictatorsModule,
  ],
  providers: [TransactionsService],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}
