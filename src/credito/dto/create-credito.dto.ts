import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min, IsInt, IsString } from 'class-validator';
import { TipoCreditoEnum } from '../entities/credito.entity';

export class CreateCreditoDto {
  @Transform(({ value }) => parseFloat(value))
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'El monto debe ser un número valido mayor a 1000 con hasta 2 decimales',
    },
  )
  @Min(1000, { message: 'El monto solicitado debe ser positivo' })
  monto_solicitado: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'El número de cuotas debe ser un entero' })
  @Min(1, { message: 'El número de cuotas debe ser positivo' })
  cantidad_cuotas: number;

  @IsString()
  @IsNotEmpty()
  tipo_credito: TipoCreditoEnum;
}
