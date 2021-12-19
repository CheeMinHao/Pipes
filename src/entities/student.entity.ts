import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Campus } from './campus.entity';
import { Course } from './course.entity';

@Entity('Student')
export class Student {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'varchar', nullable: false })
  surname: string;

  @Column({ type: 'varchar', nullable: false })
  givenName: string;

  @Column({ type: 'varchar', nullable: false })
  intake: string;

  @ManyToOne((type) => Course, (course) => course.id)
  @JoinColumn()
  course: Course;

  @ManyToOne((type) => Campus, (campus) => campus.id)
  @JoinColumn()
  campus: Campus;
}
