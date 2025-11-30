import {
  IsNotEmpty,
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @IsEmail({}, { message: 'Debe ingresar un correo electrónico válido' })
  mail: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(256)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])/, {
    message:
      'La contraseña debe incluir mayúsculas, minúsculas, números y símbolos.',
  })
  password: string;
}
