import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { UpdatePersonaDto } from './dto/update-persona.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Persona } from './entities/persona.entity';
import { Repository } from 'typeorm';
import { CreatePersonaConCreditoDto } from './dto/create-persona-con-credito.dto.ts';
import { Credito, TipoCreditoEnum } from 'src/credito/entities/credito.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class PersonaService {
  constructor(
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,

    private readonly mailService: MailService,
  ) {}

  // Creación de Persona (Postulante)
  async create(body: CreatePersonaConCreditoDto, files: any) {
    const queryRunner =
      this.personaRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validación de imágenes obligatorias
      if (
        !files ||
        !files.foto_dni_frente ||
        !files.foto_dni_dorso ||
        !files.foto_selfie_dni_en_mano ||
        !files.foto_recibo_sueldo
      ) {
        throw new HttpException('Debes subir 4 imágenes', 400);
      }

      const host = 'http://localhost:3000/uploads/personas';

      // Tomar parte PERSONA del DTO
      const personaDto = body.persona;

      // Encriptar contraseña
      personaDto.contrasenia = await bcrypt.hash(personaDto.contrasenia, 10);

      const personaData: any = {
        ...personaDto,
        foto_dni_frente: `${host}/${files.foto_dni_frente[0].filename}`,
        foto_dni_dorso: `${host}/${files.foto_dni_dorso[0].filename}`,
        foto_selfie_dni_en_mano: `${host}/${files.foto_selfie_dni_en_mano[0].filename}`,
        foto_recibo_sueldo: `${host}/${files.foto_recibo_sueldo[0].filename}`,
        estado_solicitud: 'evaluacion', //  POR DEFECTO
      };

      // Crear persona dentro de la transacción
      const persona = queryRunner.manager.create(Persona, personaData);
      const savedPersona = await queryRunner.manager.save(persona);

      // Tomar parte CREDITO del DTO
      const creditoDto = body.credito;

      // Crear crédito relacionado
      const credito = queryRunner.manager.create(Credito, {
        ...creditoDto,
        tipo_credito: creditoDto.tipo_credito as TipoCreditoEnum,
        persona: savedPersona,
      });

      const savedCredito = await queryRunner.manager.save(credito);

      // Enviar correo de registro de solicitud
      await this.mailService.enviarCorreoNotificacion(
        savedPersona,
        'evaluacion',
      );

      await queryRunner.commitTransaction();

      return {
        statusCode: 200,
        msg: 'Registro completo: Persona y Crédito creados correctamente',
        data: {
          persona: savedPersona,
          credito: savedCredito,
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error);
      throw new HttpException(
        `Error en el registro: ${error.message || error}`,
        500,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<{
    statusCode: number;
    msg: string;
    data: Persona[];
  }> {
    try {
      // Busqueda condicional ver filtrado
      const personas: Persona[] = await this.personaRepository.find();

      return {
        statusCode: HttpStatus.OK,
        msg: 'Busqueda realizada correctamente',
        data: personas,
      };
    } catch (error) {
      console.error(`Error: ${error}`);
      throw new HttpException(
        `Ocurrio un error en la búsqueda de personas`,
        404,
      );
    }
  }

  async findOne(id: number): Promise<{
    statusCode: number;
    msg: string;
    data: Persona;
  }> {
    try {
      // Busqueda de una persona sola por ID
      const persona = await this.personaRepository.findOne({
        where: { id_persona: id },
      });

      if (!persona) {
        throw new HttpException(
          `No se puedo encontrar a la persona con el id: ${id}`,
          404,
        );
      }
      return {
        statusCode: HttpStatus.OK,
        msg: `Búsqueda realizada con éxito`,
        data: persona,
      };
    } catch (error) {
      console.error(`Error: ${error}`);
      throw new HttpException(
        `Ocurrio un error en la búsqueda de personas`,
        404,
      );
    }
  }

  async update(
    id: number,
    updatePersonaDto: UpdatePersonaDto,
  ): Promise<{
    statusCode: number;
    msg: string;
    data: Persona;
  }> {
    try {
      // Buscar la persona actual
      const persona = await this.personaRepository.findOne({
        where: { id_persona: id },
      });

      if (!persona) {
        throw new HttpException(
          `No se encontró la persona con el id: ${id}`,
          HttpStatus.NOT_FOUND,
        );
      }

      // Si viene nueva contraseña, la encriptamos
      if (updatePersonaDto.contrasenia) {
        updatePersonaDto.contrasenia = await bcrypt.hash(
          updatePersonaDto.contrasenia,
          10,
        );
      } else {
        // Si no se modifica la contraseña, eliminamos el campo para no pisar la actual
        delete updatePersonaDto.contrasenia;
      }

      // Actualizar los datos permitidos
      const updatedPersona = Object.assign(persona, updatePersonaDto);

      // Guardar en DB
      const savedPersona = await this.personaRepository.save(updatedPersona);

      return {
        statusCode: HttpStatus.OK,
        msg: `Persona con el ID ${id} actualizada correctamente`,
        data: savedPersona,
      };
    } catch (error) {
      console.error(`Error: ${error}`);
      throw new HttpException(
        `Error al actualizar a la persona con el id ${id}`,
        500,
      );
    }
  }

  async remove(id: number): Promise<{
    statusCode: number;
    msg: string;
    data: Persona;
  }> {
    try {
      const { data: persona } = await this.findOne(id);
      await this.personaRepository.delete(id);
      return {
        statusCode: HttpStatus.OK,
        msg: 'Persona eliminada correctamente',
        data: persona,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        `No se pudo eliminar la persona con el id: ${id}`,
        500,
      );
    }
  }
}
