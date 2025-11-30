import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreatePagoDto {
  @IsNotEmpty({ message: 'Este campo es obligatorio' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'El monto de la cuota debe ser un número valido mayor a 1000 con hasta 2 decimales',
    },
  )
  @IsPositive({ message: 'El monto de la cuota debe ser positivo' })
  monto_cuota: number;
}
