// persona.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PersonaService } from './persona.service';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { multerPersonaConfig } from 'src/config/multer.config';
import { CreatePersonaConCreditoDto } from './dto/create-persona-con-credito.dto.ts';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/roles/role.decorator';

@Controller('rapicreditos')
export class PersonaController {
  constructor(private readonly personaService: PersonaService) {}

  @Post('signup')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'foto_dni_frente', maxCount: 1 },
        { name: 'foto_dni_dorso', maxCount: 1 },
        { name: 'foto_selfie_dni_en_mano', maxCount: 1 },
        { name: 'foto_recibo_sueldo', maxCount: 1 },
      ],
      multerPersonaConfig,
    ),
  )
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: CreatePersonaConCreditoDto,
  ) {
    console.log(body);
    return this.personaService.create(body, files);
  }

  @Get()
  findAll() {
    return this.personaService.findAll();
  }

  // 'https:/rapicreditos/panelCliente/persona/1'
  @Get('panelCliente/persona/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('CLIENTE')
  findOne(@Param('id') id: number) {
    return this.personaService.findOne(+id);
  }

  @Patch('panelCliente/persona/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('CLIENTE')
  update(@Param('id') id: string, @Body() updatePersonaDto: UpdatePersonaDto) {
    console.log(updatePersonaDto);
    return this.personaService.update(+id, updatePersonaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personaService.remove(+id);
  }
}
