import { Credito } from 'src/credito/entities/credito.entity';
import { Pago } from 'src/pago/entities/pago.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('cuota')
export class Cuota {
  @PrimaryGeneratedColumn()
  id_cuota: number;

  @Column({ type: 'int' })
  numero: number; // Cuota 1, 2, 3...

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  monto_total: number;

  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  monto_pagado: number;

  @Column({ type: 'date', nullable: false })
  fecha_vencimiento: Date;

  @Column({ type: 'bool', default: false })
  pagada: boolean;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  fecha_pago: Date;

  // Campos para mora
  @Column({ type: 'bool', default: false })
  en_mora: boolean;

  @Column({ type: 'int', default: 0 })
  dias_mora: number;

  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  monto_mora: number;

  @ManyToOne(() => Credito, (credito) => credito.cuotas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_credito' })
  credito: Credito;

  @OneToMany(() => Pago, (pago) => pago.cuota)
  pagos: Pago[];
}
