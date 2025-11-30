import { Credito } from 'src/credito/entities/credito.entity';
import { Pago } from 'src/pago/entities/pago.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ViewEntity,
  Column,
  OneToMany,
} from 'typeorm';

@Entity('persona')
export class Persona {
  @PrimaryGeneratedColumn()
  id_persona: number;

  @Column({ type: 'varchar', length: 100 })
  nombres: string;

  @Column({ type: 'varchar', length: 100 })
  apellidos: string;

  @Column({ type: 'varchar', length: 8, unique: true })
  dni: string;

  @Column({ type: 'varchar', length: 11, unique: true })
  nro_de_tramite: string;

  @Column({ type: 'varchar', length: 11 })
  telefono: string;

  @Column({ type: 'varchar', length: 150 })
  direccion: string;

  @Column({ type: 'varchar', length: 10 })
  nro_direccion: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  piso: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  dpto: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  correo_electronico: string;

  @Column({ type: 'varchar', length: 255 })
  contrasenia: string;

  @Column({ type: 'varchar' })
  foto_dni_frente: string;

  @Column({ type: 'varchar' })
  foto_dni_dorso: string;

  @Column({ type: 'varchar' })
  foto_selfie_dni_en_mano: string;

  @Column({ type: 'varchar' })
  foto_recibo_sueldo: string;

  @Column({ type: 'boolean', default: false })
  cliente: boolean; // Bandera si es cliente o no, por defecto no (False)

  // A partir de aca aplicar transacciones
  @Column({ type: 'boolean', default: false })
  creditos_activos: boolean; // Bandera si tiene creditos activo o no, por defecto no (False)

  @Column({ type: 'boolean', default: true })
  estado_postulante: boolean; // Bandera para saber si es postulante o no, por defecto es postulante(True)

  @Column({ type: 'varchar', default: 'Al día', length: 20 })
  estado_cuenta_cliente: string;

  @Column('decimal', { precision: 10, scale: 2 })
  sueldo: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  motivo_rechazo: string;

  @Column({ type: 'text', nullable: true })
  mensaje_rechazo: string;

  @Column({ type: 'varchar', length: 20, default: 'evaluacion' })
  estado_solicitud: string;

  @OneToMany(() => Credito, (credito) => credito.persona)
  creditos: Credito[];

  @OneToMany(() => Pago, (pago) => pago.persona)
  pagos: Pago[];
}
