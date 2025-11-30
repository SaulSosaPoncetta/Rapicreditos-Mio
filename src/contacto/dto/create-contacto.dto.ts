import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateContactoDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  @MaxLength(100, { message: 'El nombre no puede superar los 100 caracteres.' })
  nombres: string;

  @IsNotEmpty({ message: 'El apellido es obligatorio.' })
  @IsString({ message: 'El apellido debe ser una cadena de texto.' })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres.' })
  @MaxLength(100, {
    message: 'El apellido no puede superar los 100 caracteres.',
  })
  apellidos: string;

  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido.' })
  @MaxLength(150, {
    message: 'El correo electrónico no puede superar los 150 caracteres.',
  })
  correo_electronico: string;

  @IsNotEmpty({ message: 'El asunto es obligatorio.' })
  @IsString({ message: 'El asunto debe ser una cadena de texto.' })
  @MaxLength(150, { message: 'El asunto no puede superar los 150 caracteres.' })
  asunto: string;

  @IsNotEmpty({ message: 'El mensaje es obligatorio.' })
  @IsString({ message: 'El mensaje debe ser una cadena de texto.' })
  mensaje: string;
}
