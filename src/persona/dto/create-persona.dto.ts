import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsNumberString,
  Matches,
  IsOptional,
  IsEmail,
  IsNumber,
} from 'class-validator';

export class CreatePersonaDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede superar los 100 caracteres' })
  nombres: string;

  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  @MaxLength(100, {
    message: 'El apellido no puede superar los 100 caracteres',
  })
  apellidos: string;

  @IsNotEmpty({ message: 'El DNI es obligatorio' })
  @IsNumberString({}, { message: 'El DNI debe contener solo números' })
  @Matches(/^\d{7,8}$/, {
    message: 'El DNI debe tener entre 7 y 8 dígitos numéricos',
  })
  dni: string;

  @IsNotEmpty({ message: 'El número de trámite es obligatorio' })
  @IsNumberString(
    {},
    { message: 'El número de trámite debe contener solo números' },
  )
  @Matches(/^\d{11}$/, {
    message: 'El número de trámite debe tener exactamente 11 dígitos',
  })
  nro_de_tramite: string;

  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  @Matches(/^\d{4}-\d{6}$/, {
    message: 'El teléfono debe tener el formato xxxx-xxxxxx',
  })
  telefono: string;

  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  @IsString({ message: 'La dirección debe ser texto' })
  @MaxLength(100, {
    message: 'La dirección no puede superar los 100 caracteres',
  })
  direccion: string;

  @IsNotEmpty({ message: 'El número de dirección es obligatorio' })
  @IsNumberString(
    {},
    {
      message: 'El número de dirección debe contener solo números',
    },
  )
  @MaxLength(10, {
    message: 'El número de dirección no puede superar los 10 dígitos',
  })
  nro_direccion: string;

  @IsOptional()
  @Matches(/^\d{1,3}$/, {
    message: 'El piso debe ser numérico y tener hasta 3 dígitos',
  })
  piso?: string;

  @IsOptional()
  @Matches(/^[A-Za-z0-9]{1,50}$/, {
    message: 'El dpto debe ser alfanumérico y no superar los 50 caracteres',
  })
  dpto?: string;

  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @IsEmail({}, { message: 'El correo electrónico debe ser válido' })
  @MaxLength(100, {
    message: 'El correo electrónico no puede superar los 100 caracteres',
  })
  correo_electronico: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString({ message: 'La contraseña debe ser texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(256, {
    message: 'La contraseña no puede superar los 256 caracteres',
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/,
    {
      message:
        'La contraseña debe incluir mayúscula, minúscula, número y símbolo',
    },
  )
  contrasenia: string;

  @Transform(({ value }) => parseFloat(value)) // convierte string a number
  @IsNumber()
  sueldo: number;
}
