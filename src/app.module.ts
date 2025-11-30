import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PersonaModule } from './persona/persona.module';
import { CreditoModule } from './credito/credito.module';
import { ContactoModule } from './contacto/contacto.module';
import { PagoModule } from './pago/pago.module';
import { AdministradorModule } from './administrador/administrador.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MailModule } from './mail/mail.module';
import { VerificacionModule } from './verificacion/verificacion.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads', // <-- Esto define la URL pública
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    MailModule,
    PersonaModule,
    CreditoModule,
    ContactoModule,
    PagoModule,
    AdministradorModule,
    AuthModule,
    VerificacionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
