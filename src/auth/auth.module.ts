import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Persona } from '../persona/entities/persona.entity';
import { Administrador } from 'src/administrador/entities/administrador.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Persona, Administrador]),

    // Como ConfigModule es global, no hace falta importarlo aquí
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_SECRET') ||
          process.env.JWT_SECRET ||
          'SUPER_SECRETO',
        signOptions: {
          expiresIn:
            configService.get<string>('JWT_EXPIRES_IN') ||
            process.env.JWT_EXPIRES_IN ||
            '2h',
        },
      }),
      inject: [ConfigService],
    }),
  ],

  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule, JwtStrategy],
})
export class AuthModule {}
