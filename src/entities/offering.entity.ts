import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Unit } from './unit.entity';
import { Semester } from './semester.entity';
import { Campus } from './campus.entity';

@Entity('Offering')
export class Offering {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne((type) => Unit, (unit) => unit.id)
  @JoinColumn()
  unit: Unit;

  @ManyToOne((type) => Semester, (semester) => semester.id)
  @JoinColumn()
  semester: Semester;

  @ManyToOne((type) => Campus, (campus) => campus.id)
  @JoinColumn()
  campus: Campus;

  @Column({ type: 'int' })
  year: number;
}
