import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Faculty')
export class Faculty {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
