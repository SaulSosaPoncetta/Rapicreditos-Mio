import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CreditoService } from './credito.service';
import { CreateCreditoDto } from './dto/create-credito.dto';
import { UpdateCreditoDto } from './dto/update-credito.dto';

@Controller('rapicreditos/credito')
export class CreditoController {
  constructor(private readonly creditoService: CreditoService) { }

  @Post('persona/:id_persona')
  create(
    @Param('id_persona', ParseIntPipe) id_persona: number,
    @Body() createCreditoDto: CreateCreditoDto,
  ) {
    return this.creditoService.create(id_persona, createCreditoDto);
  }

  @Get()
  findAll() {
    return this.creditoService.findAll();
  }

  // ⭐ IMPORTANTE: Esta ruta DEBE estar ANTES de @Get(':id')
  // Si no, NestJS interpreta "persona" como un ID
  @Get('persona/:id_persona')
  findByPersona(@Param('id_persona', ParseIntPipe) id_persona: number) {
    return this.creditoService.findByPersona(id_persona);
  }

  // Esta ruta debe estar AL FINAL de todos los @Get
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.creditoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCreditoDto: UpdateCreditoDto) {
    return this.creditoService.update(+id, updateCreditoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.creditoService.remove(+id);
  }
}