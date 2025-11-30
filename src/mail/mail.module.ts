import { Module, Global } from '@nestjs/common';
import { MailService } from './mail.service';

@Global() // hace disponible el servicio en toda la app
@Module({
  providers: [MailService],
  exports: [MailService], // permite usarlo en otros módulos
})
export class MailModule {}
