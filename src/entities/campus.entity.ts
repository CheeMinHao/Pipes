import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Campus')
export class Campus {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  location: string;
}
