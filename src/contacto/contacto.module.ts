import { Module } from '@nestjs/common';
import { ContactoService } from './contacto.service';
import { ContactoController } from './contacto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contacto } from './entities/contacto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contacto])],
  controllers: [ContactoController],
  providers: [ContactoService],
})
export class ContactoModule {}
