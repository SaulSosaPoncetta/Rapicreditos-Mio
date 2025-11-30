import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Persona } from '../../persona/entities/persona.entity';
import { Cuota } from '../../cuota/entities/cuota.entity';
import { Pago } from '../../pago/entities/pago.entity';

export enum EstadoCreditoEnum {
  PENDIENTE = 'pendiente',
  APROBADO = 'aprobado',
  ACTIVO = 'activo',
  RECHAZADO = 'rechazado',
  FINALIZADO = 'finalizado',
  EN_MORA = 'En mora',
}

export enum TipoCreditoEnum {
  PERSONAL = 'Personal',
  PYME = 'PyME',
  AUTOMOTOR = 'Automotor',
}

export enum InteresCreditoEnum {
  PERSONAL = 0.35, // 35%
  PYME = 0.2, // 20%
  AUTOMOTOR = 0.15, // 15%
}

@Entity('credito')
export class Credito {
  @PrimaryGeneratedColumn()
  id_credito: number;

  @Column({
    type: 'enum',
    enum: TipoCreditoEnum,
  })
  tipo_credito: TipoCreditoEnum;

  @Column('decimal', { precision: 12, scale: 2 })
  monto_solicitado: number;

  @Column()
  cantidad_cuotas: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_solicitud: Date;

  @Column({
    type: 'enum',
    enum: EstadoCreditoEnum,
    default: EstadoCreditoEnum.PENDIENTE,
  })
  estado_credito: EstadoCreditoEnum;

  @ManyToOne(() => Persona, (persona) => persona.creditos)
  persona: Persona;

  @OneToMany(() => Cuota, (cuota) => cuota.credito)
  cuotas: Cuota[];

  @OneToMany(() => Pago, (pago) => pago.credito)
  pagos: Pago[];
}
