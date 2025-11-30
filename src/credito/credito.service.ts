import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCreditoDto } from './dto/create-credito.dto';
import { UpdateCreditoDto } from './dto/update-credito.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Credito, TipoCreditoEnum } from './entities/credito.entity';
import { Repository } from 'typeorm';
import { Persona } from 'src/persona/entities/persona.entity';

@Injectable()
export class CreditoService {
  constructor(
    @InjectRepository(Credito)
    private readonly creditoRepository: Repository<Credito>,

    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
  ) {}

  // ============================================
  // 🔥 CREATE — Recibe id_persona + DTO
  // ============================================
  async create(
    id_persona: number,
    createCreditoDto: CreateCreditoDto,
  ): Promise<{
    statusCode: number;
    msg: string;
    data: Credito;
  }> {
    try {
      // 1. Verificar persona existente
      const persona = await this.personaRepository.findOne({
        where: { id_persona },
      });

      if (!persona) {
        throw new HttpException(
          `No existe una persona con el ID ${id_persona}`,
          HttpStatus.NOT_FOUND,
        );
      }

      // 2. Crear el crédito con la relación
      const newCredito = this.creditoRepository.create({
        ...createCreditoDto,
        tipo_credito: createCreditoDto.tipo_credito as TipoCreditoEnum,
        persona,
      });

      const savedCredit = await this.creditoRepository.save(newCredito);

      return {
        statusCode: HttpStatus.OK,
        msg: 'Crédito creado correctamente',
        data: savedCredit,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException('Error al crear el crédito', 500);
    }
  }

  // ============================================
  // GET ALL
  // ============================================
  async findAll(): Promise<{
    statusCode: number;
    msg: string;
    data: Credito[];
  }> {
    try {
      const creditos = await this.creditoRepository.find({
        relations: ['persona'],
      });

      return {
        statusCode: HttpStatus.OK,
        msg: 'Créditos obtenidos correctamente',
        data: creditos,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException('Error al obtener los créditos', 500);
    }
  }

  // ============================================
  // GET ONE
  // ============================================
  async findOne(id: number) {
    try {
      const credito = await this.creditoRepository.findOne({
        where: { id_credito: id },
        relations: ['persona'],
      });

      if (!credito) {
        throw new HttpException(
          `No se pudo encontrar el crédito con el id ${id}`,
          404,
        );
      }

      return {
        statusCode: HttpStatus.OK,
        msg: `Crédito encontrado`,
        data: credito,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException('Error al obtener el crédito', 500);
    }
  }

  // ============================================
  // UPDATE
  // ============================================
  async update(id: number, updateCreditoDto: UpdateCreditoDto) {
    try {
      const credito = await this.creditoRepository.preload({
        id_credito: id,
        ...updateCreditoDto,
        tipo_credito: updateCreditoDto.tipo_credito as TipoCreditoEnum,
      });

      if (!credito) {
        throw new HttpException(`No existe el crédito con ID ${id}`, 404);
      }

      const saved = await this.creditoRepository.save(credito);

      return {
        statusCode: HttpStatus.OK,
        msg: 'Crédito actualizado correctamente',
        data: saved,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException('Error al actualizar el crédito', 500);
    }
  }

  // ============================================
  // DELETE
  // ============================================
  async remove(id: number) {
    try {
      const credito = await this.creditoRepository.findOne({
        where: { id_credito: id },
      });

      if (!credito) {
        throw new HttpException(`No existe el crédito con ID ${id}`, 404);
      }

      await this.creditoRepository.delete(id);

      return {
        statusCode: 200,
        msg: `Crédito eliminado correctamente`,
        data: credito,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException('Error al eliminar el crédito', 500);
    }
  }

  // ============================================
  // GET CREDITO BY PERSONA ID
  // ============================================
  async findByPersona(id_persona: number): Promise<{
    statusCode: number;
    msg: string;
    data: Credito | null;
  }> {
    try {
      const credito = await this.creditoRepository.findOne({
        where: { persona: { id_persona } },
        relations: ['persona'],
        order: { fecha_solicitud: 'DESC' }, // Obtener el más reciente
      });

      if (!credito) {
        return {
          statusCode: HttpStatus.OK,
          msg: 'No se encontró crédito para esta persona',
          data: null,
        };
      }

      return {
        statusCode: HttpStatus.OK,
        msg: 'Crédito encontrado correctamente',
        data: credito,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException('Error al obtener el crédito', 500);
    }
  }
}
