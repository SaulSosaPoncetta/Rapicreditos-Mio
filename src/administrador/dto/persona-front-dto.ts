// src/administrador/dto/persona-front.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreditoFrontDto {
  @ApiProperty() id_credito: number;
  @ApiProperty() tipo_credito: string;
  @ApiProperty() monto_solicitado: number;
  @ApiProperty() cantidad_cuotas: number;
  @ApiProperty() estado_credito: boolean;
  @ApiProperty() fecha_solicitud: string;
}

export class PersonaFrontDto {
  @ApiProperty() id_persona: number;
  @ApiProperty() nombres: string;
  @ApiProperty() apellidos: string;
  @ApiProperty() dni: string;
  @ApiProperty() nro_de_tramite: string;
  @ApiProperty() telefono: string;
  @ApiProperty() correo_electronico: string;
  @ApiProperty() direccion: string;
  @ApiProperty() nro_direccion: string;
  @ApiProperty({ required: false }) piso?: string;
  @ApiProperty({ required: false }) dpto?: string;

  @ApiProperty({ type: Number, nullable: true }) sueldo: number;
  @ApiProperty() estado_cuenta_cliente: string;
  @ApiProperty() estado_postulante: boolean;

  @ApiProperty({ isArray: true, type: () => CreditoFrontDto })
  creditos: CreditoFrontDto[];

  @ApiProperty() foto_dni_frente: string;
  @ApiProperty() foto_dni_dorso: string;
  @ApiProperty() foto_recibo_sueldo: string;
  @ApiProperty() foto_selfie_dni_en_mano: string;
}
