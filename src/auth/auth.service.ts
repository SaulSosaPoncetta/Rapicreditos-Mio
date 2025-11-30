import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Persona } from '../persona/entities/persona.entity';
import { Administrador } from 'src/administrador/entities/administrador.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Persona)
    private readonly personaRepo: Repository<Persona>,

    @InjectRepository(Administrador)
    private readonly administradorRepo: Repository<Administrador>,

    private readonly jwtService: JwtService,
  ) {}

  /**
   * login: compara password hasheada y genera token con rol normalizado
   */
  async login(mail: string, password: string) {
    console.log('📧 Email recibido:', mail, password);
    // Verificar si es ADMIN
    const admin = await this.administradorRepo.findOne({
      where: { correo_electronico: mail },
    });

    if (admin) {
      // admin.contrasenia debe estar hasheada en BD
      const matches = await bcrypt.compare(
        password,
        (admin as any).contrasenia,
      );
      if (!matches) throw new UnauthorizedException('Credenciales incorrectas');

      const payload = {
        email: admin.correo_electronico,
        rol: 'ADMIN' as const,
      };

      const token = this.jwtService.sign(payload);

      return { token, rol: 'ADMIN' as const };
    }

    // Verificar si es PERSONA NORMAL

    // mail: 'saul10@gmail.com', password: 'Saul1234@'
    const persona = await this.personaRepo.findOne({
      where: { correo_electronico: mail },
    });

    console.log('👤 Usuario encontrado:', persona ? 'SÍ' : 'NO');

    // Aca tenemos que colocar el statusCode correspondiente
    if (!persona) throw new UnauthorizedException('Credenciales incorrectas');

    const match = await bcrypt.compare(password, (persona as any).contrasenia);

    console.log(match, password);
    console.log((persona as any).contrasenia);
    // Aca tenemos que colocar el statusCode correspondiente
    if (!match) throw new UnauthorizedException('Credenciales incorrectas');

    // Crea la firma con ID, email y rol para el token
    const payload = {
      id: (persona as any).id_persona,
      email: persona.correo_electronico,
      rol: 'CLIENTE' as const,
    };

    // Crea el token con la firma
    const token = this.jwtService.sign(payload);

    // Saneamos el objeto persona para no devolver la contraseña
    const personaSafe = { ...persona } as any;
    if (personaSafe.password) delete personaSafe.password;

    return { token, rol: 'CLIENTE', persona: personaSafe };
  }
}
