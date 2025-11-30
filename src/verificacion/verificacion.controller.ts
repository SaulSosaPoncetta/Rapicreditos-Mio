import { Controller, Post, Body } from '@nestjs/common';
import { VerificacionService } from './verificacion.service';
import { EnviarCodigoDto } from './dto/enviar-codigo.dto';
import { ValidarCodigoDto } from './dto/validar-codigo.dto';

@Controller('rapicreditos/signup')
export class VerificacionController {
  constructor(private readonly verificacionService: VerificacionService) {}

  @Post('enviar-codigo')
  async enviar(@Body() body: EnviarCodigoDto) {
    return this.verificacionService.enviarCodigo(body.correo_electronico);
  }

  @Post('validar-codigo')
  async validar(@Body() body: ValidarCodigoDto) {
    return this.verificacionService.verificarCodigo(
      body.correo_electronico,
      body.codigo,
    );
  }
}
