import { IsEmail } from 'class-validator';

export class EnviarCodigoDto {
  @IsEmail()
  correo_electronico: string;
}
