import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum TransactionStatus {
  COMPLETED = 'Completed',
  FAILED = 'Failed',
  DISCOVERED = 'Discovered',
}

@Entity()
export class Transactions {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  buyer_id: string;

  @Column({ type: 'uuid' })
  seller_id: string;

  @Column()
  item: string;

  @Column({ type: 'decimal' })
  amount: number;

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.COMPLETED })
  status: TransactionStatus;
}
