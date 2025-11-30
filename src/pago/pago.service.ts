import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pago } from './entities/pago.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PagoService {
  constructor(
    @InjectRepository(Pago) private readonly pagoRepository: Repository<Pago>,
  ) {}

  async create(createPagoDto: CreatePagoDto): Promise<{
    statusCode: number;
    msg: string;
    data: Pago;
  }> {
    try {
      const pago = this.pagoRepository.create(createPagoDto);
      const savedPago = await this.pagoRepository.save(pago);

      return {
        statusCode: HttpStatus.OK,
        msg: 'Pago creado correctamente',
        data: savedPago,
      };
    } catch (error) {
      // Solo para debugging
      console.error(`Error: ${error}`);
      throw new HttpException(`Error al crear el pago`, 500);
    }
  }

  async findAll(): Promise<{
    statusCode: number;
    msg: string;
    data: Pago[];
  }> {
    try {
      const pagos = await this.pagoRepository.find();
      if (!pagos || pagos.length === 0) {
        throw new HttpException(`No se encontrarón pagos`, 404);
      }

      return {
        statusCode: HttpStatus.OK,
        msg: 'La búsqueda de los pagos se realizo correctamente',
        data: pagos,
      };
    } catch (error) {
      console.error(`Error: ${error}`);
      throw new HttpException(`Ocurrió un error al buscar los pagos`, 500);
    }
  }

  async findOne(id: number): Promise<{
    statusCode: number;
    msg: string;
    data: Pago;
  }> {
    try {
      const pago = await this.pagoRepository.findOne({
        where: { id_pago: id },
      });
      if (!pago) {
        throw new HttpException(`No se encontró el pago con el id ${id}`, 404);
      }

      return {
        statusCode: HttpStatus.OK,
        msg: `La búsqueda del pago con el id ${id} se realizo correctamente`,
        data: pago,
      };
    } catch (error) {
      console.error(`Error: ${error}`);
      throw new HttpException(`Ocurrió un error al buscar el pago`, 500);
    }
  }

  async update(
    id: number,
    updatePagoDto: UpdatePagoDto,
  ): Promise<{
    statusCode: number;
    msg: string;
    data: Pago;
  }> {
    try {
      const pago = await this.pagoRepository.preload({
        id_pago: id,
        ...updatePagoDto,
      });

      if (!pago) {
        throw new HttpException(`No se encontró el pago con el id ${id}`, 404);
      }

      const savedPago = await this.pagoRepository.save(pago);
      return {
        statusCode: HttpStatus.OK,
        msg: `El pago con el id ${id} se actualizó correctamente`,
        data: savedPago,
      };
    } catch (error) {
      console.error(`Error: ${error}`);
      throw new HttpException(
        `Ocurrió un error al actualizar el pago con el id ${id}`,
        500,
      );
    }
  }

  async remove(id: number): Promise<{
    statusCode: number;
    msg: string;
    data: Pago;
  }> {
    try {
      const { data: pago } = await this.findOne(id);
      await this.pagoRepository.delete(id);
      return {
        statusCode: HttpStatus.OK,
        msg: `El pago con el id ${id} fue eliminado correctamente`,
        data: pago,
      };
    } catch (error) {
      console.error(`Error: ${error}`);
      throw new HttpException(
        `Ocurrió un error al eliminar el pago con el id: ${id}`,
        500,
      );
    }
  }
}
