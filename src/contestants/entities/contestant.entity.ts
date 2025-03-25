import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum ContestantStatus {
  ALIVE = 'Alive',
  DEAD = 'Dead',
  ESCAPED = 'Escaped',
  FREE = 'Free',
}

@Entity()
export class Contestant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  nickname: string;

  @Column()
  origin: string;

  @Column({ type: 'int' })
  strength: number;

  @Column({ type: 'int' })
  agility: number;

  @Column({ type: 'int' })
  health: number;

  @Column({ type: 'int', default: 0 })
  wins: number;

  @Column({ type: 'int', default: 0 })
  losses: number;

  @Column({ type: 'enum', enum: ContestantStatus, default: ContestantStatus.ALIVE })
  status: ContestantStatus;
}
