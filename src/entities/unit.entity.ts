import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Faculty } from './faculty.entity';

@Entity('Unit')
export class Unit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  unitCode: string;

  @Column({ type: 'varchar', length: 500 })
  name: string;

  @Column({ type: 'varchar', length: 500 })
  overview: string;

  @ManyToOne((type) => Faculty, (faculty) => faculty.id)
  @JoinColumn()
  faculty: Faculty;

  @Column({ type: 'int' })
  creditPoints: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
