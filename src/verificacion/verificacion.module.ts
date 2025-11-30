import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationCode } from './entity/verificacion-codigo.entity';
import { VerificacionService } from './verificacion.service';
import { VerificacionController } from './verificacion.controller';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([VerificationCode]), MailModule],
  providers: [VerificacionService],
  controllers: [VerificacionController],
  exports: [VerificacionService],
})
export class VerificacionModule {}
