import { SetMetadata } from '@nestjs/common';

/**
 * Normalizamos los roles a estos dos valores para todo el sistema:
 *  - 'ADMIN'
 *  - 'CLIENTE'
 *
 * Usar: @Role('ADMIN') o @Role('CLIENTE')
 */
export const Role = (rol: 'ADMIN' | 'CLIENTE') => SetMetadata('rol', rol);
