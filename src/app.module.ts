import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { ContestantsModule } from './contestants/contestants.module';
import { BattlesModule } from './battles/battles.module';
import { DictatorsModule } from './dictators/dictators.module';
import { SponsorsModule } from './sponsors/sponsors.module';
import { TransactionsModule } from './transactions/transactions.module';
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);
@Module({
  imports: [ContestantsModule, BattlesModule, DictatorsModule, SponsorsModule, TransactionsModule,
    ConfigModule.forRoot({
      envFilePath: './.env', // Asegura que la ruta sea correcta
      isGlobal: true,
      
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true,
      })
    }),
  ],
})
export class AppModule {}



//import { Contestant } from './entities/contestant.entity';
//import { Battles } from './battles/battle.entity';
//import { Dictators } from './dictators/dictator.entity';
//import { Sponsors } from './sponsors/sponsor.entity';
//import { Transactions } from './transactions/transaction.entity';