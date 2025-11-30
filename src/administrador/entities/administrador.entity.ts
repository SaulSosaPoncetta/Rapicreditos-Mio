import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('administrador')
export class Administrador {
  @PrimaryGeneratedColumn()
  id_administrador: number;

  @Column({ type: 'varchar', length: 100 })
  nombres: string;

  @Column({ type: 'varchar', length: 100 })
  apellidos: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  correo_electronico: string;

  @Column({ type: 'varchar', length: 255 })
  contrasenia: string;
}
