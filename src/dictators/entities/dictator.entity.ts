import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Dictator {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  territory: string;

  @Column({ type: 'int', default: 0 })
  plata: number;

  @Column({ type: 'int', default: 0 })
  number_of_slaves: number;

  @Column({ type: 'int', default: 100 }) // 100 = lealtad total
  loyalty_to_Carolina: number;
}
