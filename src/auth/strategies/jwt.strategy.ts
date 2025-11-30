import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Persona } from '../../persona/entities/persona.entity';
import { Administrador } from '../../administrador/entities/administrador.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Persona)
    private readonly personaRepo: Repository<Persona>,

    @InjectRepository(Administrador)
    private readonly adminRepo: Repository<Administrador>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'SUPER_SECRETO',
      ignoreExpiration: false,
    });
  }

  /**
   * payload esperado:
   *  - si admin: { email, rol: 'ADMIN' }
   *  - si cliente: { id, email, rol: 'CLIENTE' }
   *
   * Se busca en BD para validar que el usuario exista y esté activo.
   * Retornamos un objeto saneado que será request.user
   */
  async validate(payload: any) {
    if (!payload || !payload.rol) {
      throw new UnauthorizedException('Token inválido');
    }

    if (payload.rol === 'ADMIN') {
      if (!payload.email) throw new UnauthorizedException('Token inválido');
      const admin = await this.adminRepo.findOne({
        where: { correo_electronico: payload.email },
      });
      if (!admin)
        throw new UnauthorizedException('Token inválido: admin no encontrado');
      // Opcional: chequear campo activo si existe
      if ((admin as any).activo === false) {
        throw new UnauthorizedException(
          'Cuenta de administrador deshabilitada',
        );
      }
      return {
        id: (admin as any).id_administrador ?? null,
        email: admin.correo_electronico,
        rol: 'ADMIN',
      };
    }

    if (payload.rol === 'CLIENTE') {
      if (!payload.id) throw new UnauthorizedException('Token inválido');
      const persona = await this.personaRepo.findOne({
        where: { id_persona: payload.id },
      });
      if (!persona)
        throw new UnauthorizedException(
          'Token inválido: usuario no encontrado',
        );
      if ((persona as any).activo === false) {
        throw new UnauthorizedException('Cuenta de usuario deshabilitada');
      }
      return {
        id: (persona as any).id_persona,
        email: persona.correo_electronico,
        rol: 'CLIENTE',
      };
    }

    throw new UnauthorizedException('Rol inválido en token');
  }
}
