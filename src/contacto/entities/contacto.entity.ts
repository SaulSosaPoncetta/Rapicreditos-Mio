import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('contacto')
export class Contacto {
  @PrimaryGeneratedColumn()
  id_contacto: number;

  @Column({ type: 'varchar', length: 100 })
  nombres: string;

  @Column({ type: 'varchar', length: 100 })
  apellidos: string;

  @Column({ type: 'varchar', length: 150 })
  correo_electronico: string;

  @Column({ type: 'varchar', length: 150 })
  asunto: string;

  @Column({ type: 'text' })
  mensaje: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_envio: Date;
}
