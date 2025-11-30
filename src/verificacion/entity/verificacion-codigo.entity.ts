import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'codigo_verificacion' })
export class VerificationCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  correo_electronico: string;

  @Column({ length: 10 })
  codigo: string;

  @CreateDateColumn({ type: 'timestamp' })
  creado_en: Date;
}
