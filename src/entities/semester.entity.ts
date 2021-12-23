import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Semester')
export class Semester {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;
}
