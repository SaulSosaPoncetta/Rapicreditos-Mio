import { Module } from '@nestjs/common';
import { PersonaService } from './persona.service';
import { PersonaController } from './persona.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Persona } from './entities/persona.entity';
import { Credito } from 'src/credito/entities/credito.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Persona, Credito])],
  controllers: [PersonaController],
  providers: [PersonaService],
  exports: [PersonaService],
})
export class PersonaModule {}
