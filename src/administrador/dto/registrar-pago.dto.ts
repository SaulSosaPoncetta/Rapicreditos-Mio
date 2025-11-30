import { IsNumber, Min, IsOptional, IsString } from 'class-validator';

export class RegistrarPagoDto {
  @IsNumber()
  @Min(1)
  personaId: number;

  @IsNumber()
  @Min(1)
  monto: number;

  @IsOptional()
  @IsNumber()
  creditoId?: number;

  @IsOptional()
  @IsString()
  mensaje?: string;

  @IsNumber()
  @Min(1)
  cuota: number;
}
