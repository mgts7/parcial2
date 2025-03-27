import { Entity, PrimaryGeneratedColumn, Column ,JoinColumn,ManyToOne} from 'typeorm';
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
  

  @Column({ type: 'uuid', nullable: true })
  winner_id: string;

  @Column({ type: 'boolean' })
  death_occurred: boolean;

  @Column()
  injuries: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;
  winner: any;
  loser: any;
}