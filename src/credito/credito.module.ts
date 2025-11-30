import { Module } from '@nestjs/common';
import { CreditoService } from './credito.service';
import { CreditoController } from './credito.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credito } from './entities/credito.entity';
import { Persona } from 'src/persona/entities/persona.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Credito, Persona])],
  controllers: [CreditoController],
  providers: [CreditoService],
})
export class CreditoModule {}
