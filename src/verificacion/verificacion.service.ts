import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VerificationCode } from './entity/verificacion-codigo.entity';
import { Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';

@Injectable()
export class VerificacionService {
  // Expiración en minutos
  private readonly EXPIRACION_MINUTOS = 10;

  constructor(
    @InjectRepository(VerificationCode)
    private readonly repo: Repository<VerificationCode>,
    private readonly mailService: MailService,
  ) {}

  private generarCodigo(): string {
    // 6 dígitos numéricos (100000-999999)
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async enviarCodigo(correo_electronico: string) {
    if (!correo_electronico) throw new BadRequestException('Correo requerido');

    const codigo = this.generarCodigo();

    // Guardar en BD
    const registro = this.repo.create({ correo_electronico, codigo });
    await this.repo.save(registro);

    // Enviar correo usando método especializado del MailService
    // tu MailService tendrá el método 'enviarCodigoVerificacion'
    await this.mailService.enviarCodigoVerificacion(correo_electronico, codigo);

    // Para desarrollo devolveremos un mensaje; en prod no devolver el código
    return { mensaje: 'Código enviado al correo' };
  }

  async verificarCodigo(correo_electronico: string, codigo: string) {
    console.log(correo_electronico, codigo);
    if (!correo_electronico || !codigo)
      throw new BadRequestException('Parámetros inválidos');

    // Buscar registro más reciente con ese correo y código
    const registro = await this.repo.findOne({
      where: { correo_electronico, codigo },
      order: { creado_en: 'DESC' },
    });

    if (!registro) throw new BadRequestException('Código incorrecto');

    // Validar expiración
    const ahora = new Date().getTime();
    const creado = new Date(registro.creado_en).getTime();
    const diffMin = (ahora - creado) / 1000 / 60;
    if (diffMin > this.EXPIRACION_MINUTOS) {
      throw new BadRequestException('Código expirado');
    }

    // Opcional: podrías marcarlo como usado (borrarlo o almacenar un flag).
    // await this.repo.delete(registro.id);

    return { valido: true, mensaje: 'Código validado' };
  }
}
