import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Credito } from '../../credito/entities/credito.entity';
import { Persona } from '../../persona/entities/persona.entity';
import { Cuota } from 'src/cuota/entities/cuota.entity';

@Entity('pago')
export class Pago {
  @PrimaryGeneratedColumn()
  id_pago: number;

  @Column('decimal', { precision: 12, scale: 2 })
  monto_cuota: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  monto_mora: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_pago: Date;

  @Column({ nullable: true })
  mensaje?: string;

  @ManyToOne(() => Cuota, { nullable: true })
  cuota?: Cuota;

  @ManyToOne(() => Persona)
  persona: Persona;

  @ManyToOne(() => Credito)
  credito: Credito;
}
