import {
  Entity,
  Column,
  ManyToOne,
  Index,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Faculty } from './faculty.entity';

@Entity('Course')
@Index(['courseCode'], { unique: true })
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  courseCode: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ManyToOne((type) => Faculty, (faculty) => faculty.id)
  @JoinColumn()
  faculty: Faculty;
}
