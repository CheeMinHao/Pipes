import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Offering } from './offering.entity';
import { Student } from './student.entity';

export enum Grades {
  HD,
  D,
  C,
  P,
  N,
  DEF,
  E,
  HI,
  HIIA,
  HIIB,
  NA,
  NAS,
  NE,
  NGO,
  NH,
  NS,
  NSR,
  PGO,
  SFR,
  WDN,
  WH,
  WI,
  WN,
}

@Entity('Enrolment')
export class Enrolment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne((type) => Student, (student) => student.id)
  @JoinColumn()
  student: Student;

  @ManyToOne((type) => Offering, (offering) => offering.id)
  @JoinColumn()
  offering: Offering;

  @Column({ type: 'date' })
  commencementDate: Date;

  @Column({ type: 'enum', enum: Grades, enumName: 'Grades' })
  grades: Grades;

  @Column({ type: 'int' })
  marks: number;

  @Column({ type: 'int' })
  year: number;
}
