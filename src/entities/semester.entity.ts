import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum SemesterId {
  'S2-01',
  'FY-01',
  'SSB-01',
  'SSA-02',

  'SS-S1-01',
  'S1-01',
  'OCT-MY-01',
  'SS-29A',

  'WS-01',
  'S2-S1-02',
  'SSB-ALT',
  'S2-29',

  'S1-29',
}

@Entity('Semester')
export class Semester {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;
}
