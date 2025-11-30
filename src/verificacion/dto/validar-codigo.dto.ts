import { IsEmail, IsString, Length } from 'class-validator';

export class ValidarCodigoDto {
  @IsEmail()
  correo_electronico: string;

  @IsString()
  @Length(6, 6)
  codigo: string;
}
