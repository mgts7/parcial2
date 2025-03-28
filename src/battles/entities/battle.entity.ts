import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Contestant } from '../../contestants/entities/contestant.entity';

@Entity()
export class Battles {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Contestant)
  @JoinColumn({ name: 'contestant1' })
  contestant1: Contestant;

  @ManyToOne(() => Contestant)
  @JoinColumn({ name: 'contestant2' })
  contestant2: Contestant;

  @ManyToOne(() => Contestant)
  @JoinColumn({ name: 'winner_id' })
  winner: Contestant;

  @Column({ type: 'boolean' })
  death_occurred: boolean;

  @Column()
  injuries: string;

  loser: any;
}
