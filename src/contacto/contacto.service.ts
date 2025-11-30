import { HttpException, Injectable } from '@nestjs/common';
import { CreateContactoDto } from './dto/create-contacto.dto';
import { UpdateContactoDto } from './dto/update-contacto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Contacto } from './entities/contacto.entity';
import { Repository, MoreThan } from 'typeorm';
import * as nodemailer from 'nodemailer';
@Injectable()
export class ContactoService {
  constructor(
    @InjectRepository(Contacto)
    private readonly contactoRepository: Repository<Contacto>,
  ) {}
  async create(createContactoDto: CreateContactoDto) {
    try {
      // Verificar si el usuario ya envió hace menos de 10 minutos

      // Restamos ese valor al tiempo actual para obtener la hora exacta de hace 10 minutos
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000); //expresados en milisegundos

      const lastMessage = await this.contactoRepository.findOne({
        where: {
          correo_electronico: createContactoDto.correo_electronico,
          fecha_envio: MoreThan(tenMinutesAgo),
        },
      });

      if (lastMessage) {
        throw new HttpException(
          'Por favor, espera 10 minutos antes de enviar otro mensaje.',
          429,
        );
      }

      // Guardar el nuevo mensaje
      const newContact = this.contactoRepository.create(createContactoDto);
      const savedContact = await this.contactoRepository.save(newContact);

      // Crear el transporte de Nodemailer
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      });

      // Configurar el correo
      const mailOptions = {
        from: `"Soporte - Rapicreditos" <${process.env.MAIL_USER}>`,
        to: savedContact.correo_electronico,
        subject: 'Hemos recibido tu mensaje',
        html: `
          <h2>Hola ${savedContact.nombres},</h2>
          <p>Gracias por contactarte con nosotros. Hemos recibido tu mensaje y te responderemos a la brevedad.</p>
          <br>
          <p>Saludos,<br>El equipo de soporte de Rapicréditos.</p>
        `,
      };

      // Enviar el correo
      await transporter.sendMail(mailOptions);

      return {
        statusCode: 201,
        message: 'Mensaje recibido correctamente.',
        data: savedContact,
      };
    } catch (error) {
      console.error('Error al crear el contacto:', error);

      if (error instanceof HttpException) {
        throw error; // Reenvía el error original (incluye el de "espera 10 minutos")
      }

      throw new HttpException(
        'No se pudo procesar el mensaje. Intenta nuevamente.',
        500,
      );
    }
  }

  findAll() {
    return `This action returns all contacto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} contacto`;
  }

  update(id: number, updateContactoDto: UpdateContactoDto) {
    return `This action updates a #${id} contacto`;
  }

  remove(id: number) {
    return `This action removes a #${id} contacto`;
  }
}
