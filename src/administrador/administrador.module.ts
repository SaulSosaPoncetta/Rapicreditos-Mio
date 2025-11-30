import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Administrador } from './entities/administrador.entity';
import { AdministradorService } from './administrador.service';
import { AdministradorController } from './administrador.controller';
import { Persona } from 'src/persona/entities/persona.entity';
import { Pago } from 'src/pago/entities/pago.entity';
import { Credito } from 'src/credito/entities/credito.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthModule } from 'src/auth/auth.module';
import { Cuota } from 'src/cuota/entities/cuota.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Administrador, Persona, Pago, Cuota, Credito]),
    AuthModule,
  ],
  controllers: [AdministradorController],
  providers: [AdministradorService, RolesGuard],
})
export class AdministradorModule {}
