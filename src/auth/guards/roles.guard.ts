import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRol = this.reflector.get<string>('rol', context.getHandler());
    if (!requiredRol) return true; // ruta pública o no protegida por rol

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.rol) {
      throw new ForbiddenException('No tenés permiso para acceder a esta ruta');
    }

    // Normalizamos comparación
    if (user.rol !== requiredRol) {
      throw new ForbiddenException('No tenés permiso para acceder a esta ruta');
    }

    return true;
  }
}
