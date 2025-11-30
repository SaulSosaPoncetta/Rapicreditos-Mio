import { IsString, IsNotEmpty } from 'class-validator';

export class RechazarPostulanteDto {
  @IsString()
  @IsNotEmpty()
  motivo_rechazo: string;

  @IsString()
  @IsNotEmpty()
  mensaje_rechazo: string;
}
