import {
  IsOptional,
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class UpdateAdministradorDto {
  @IsOptional()
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @IsEmail({}, { message: 'El correo electrónico debe ser válido' })
  @MaxLength(100, {
    message: 'El correo electrónico no puede superar los 100 caracteres',
  })
  correo_electronico: string;

  @IsOptional()
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
}
