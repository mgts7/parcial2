import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactions, TransactionStatus } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Dictator } from '../dictators/entities/dictator.entity';


@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private transactionsRepository: Repository<Transactions>,
    
    @InjectRepository(Dictator)
    private dictatorsRepository: Repository<Dictator>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const { buyer_id, seller_id, amount } = createTransactionDto;
    
    const buyer = await this.dictatorsRepository.findOne({ where: { id: buyer_id } });
    const seller = await this.dictatorsRepository.findOne({ where: { id: seller_id } });

    if (!buyer || !seller) {
      throw new Error('Buyer or Seller not found');
    }

    if (buyer.plata < amount) {
      throw new Error('Insufficient funds');
    }

    buyer.plata -= amount;
    seller.plata += amount;
    
    await this.dictatorsRepository.save([buyer, seller]);

    const transaction = this.transactionsRepository.create({
      ...createTransactionDto,
      status: TransactionStatus.COMPLETED,
    });
    return this.transactionsRepository.save(transaction);
  }

  async findAll() {
    return this.transactionsRepository.find();
  }

  findOne(id: string) {
    return this.transactionsRepository.findOne({ where: { id } });
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    await this.transactionsRepository.update(id, updateTransactionDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const transaction = await this.findOne(id);
    if (transaction) {
      await this.transactionsRepository.remove(transaction);
      return { message: 'Transaction removed' };
    }
    return { message: 'Transaction not found' };
  }
}
