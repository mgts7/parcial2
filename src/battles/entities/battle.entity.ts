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

  // Agregamos la relación para winner
  @ManyToOne(() => Contestant, { nullable: true })
  @JoinColumn({ name: 'winner_id' })
  winner: Contestant;

  @Column({ type: 'boolean' })
  death_occurred: boolean;

  @Column()
  injuries: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  // Puedes eliminar la propiedad loser si no la usas directamente
  loser: any;
}
