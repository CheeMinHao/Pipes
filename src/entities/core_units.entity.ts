import { PrimaryGeneratedColumn, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Course } from './course.entity';
import { Unit } from './unit.entity';

@Entity('CoreUnits')
export class CoreUnits {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne((type) => Course, (course) => course.id)
  @JoinColumn()
  course: Course;

  @ManyToOne((type) => Unit, (unit) => unit.id)
  @JoinColumn()
  unit: Unit;
}
