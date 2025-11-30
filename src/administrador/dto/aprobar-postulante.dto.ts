import { IsNumber, Min } from 'class-validator';

export class AprobarPostulanteDto {
  @IsNumber()
  @Min(1)
  monto_aprobado: number;

  @IsNumber()
  @Min(1)
  cuotas: number;
}
