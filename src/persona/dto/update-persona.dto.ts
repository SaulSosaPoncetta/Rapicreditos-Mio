import { IsOptional, IsString, IsEmail, Matches } from 'class-validator';

export class UpdatePersonaDto {
  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  nro_direccion?: string;

  @IsOptional()
  @Matches(/^\d{0,3}$/, {
    message: 'El piso debe ser numérico y tener hasta 3 dígitos',
  })
  piso?: string;

  @IsOptional()
  @Matches(/^[a-zA-Z0-9]{0,50}$/, {
    message: 'El dpto debe ser alfanumérico y no superar los 50 caracteres',
  })
  dpto?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Correo electrónico inválido' })
  correo_electronico?: string;

  @IsOptional()
  @IsString()
  contrasenia?: string;
}
