import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ContestantsModule } from './contestants/contestants.module';
import { BattlesModule } from './battles/battles.module';
import { DictatorsModule } from './dictators/dictators.module';
import { SponsorsModule } from './sponsors/sponsors.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';



@Module({
  controllers: [AppController], // Asegura que esté aquí
  providers: [AppService],
  imports: [ContestantsModule, BattlesModule, DictatorsModule, SponsorsModule, TransactionsModule,
    ConfigModule.forRoot({
      envFilePath: './.env', // Asegura que la ruta sea correcta
      isGlobal: true,
      
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || '', // Evita el error de TypeScript
      ssl: process.env.DATABASE_URL?.includes("sslmode=no-verify") ? false : { rejectUnauthorized: false },
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
      synchronize: true,
      autoLoadEntities: true,
    }),
    
  ],
})
export class AppModule {}



//import { Contestant } from './entities/contestant.entity';
//import { Battles } from './battles/battle.entity';
//import { Dictators } from './dictators/dictator.entity';
//import { Sponsors } from './sponsors/sponsor.entity';
//import { Transactions } from './transactions/transaction.entity';