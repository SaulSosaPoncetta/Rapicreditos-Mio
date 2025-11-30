import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  // Enviar correo notificacion estados de solicitud
  async enviarCorreoNotificacion(
    persona: any,
    tipo: 'evaluacion' | 'aprobado' | 'rechazado',
    data?: {
      motivo_rechazo?: string;
      mensaje_rechazo?: string;
      monto_aprobado?: number;
      cuotas?: number;
    },
  ) {
    // Crear transporte
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    // Definir asunto y mensaje
    let subject = '';
    let html = '';

    switch (tipo) {
      case 'evaluacion':
        subject = 'Tu solicitud está siendo evaluada - Rapicréditos';
        html = `
          <h2 style="color:#211652;">Hola ${persona.nombres},</h2>
          <p>Tu solicitud está actualmente <strong style="color:#211652;">en evaluación</strong>.</p>
          <p>Uno de nuestros asesores revisará tu documentación.</p>
          <br>
          <p>Te avisaremos apenas haya una actualización.</p>
          <br>
          <p>Saludos,<br>Equipo de Rapicréditos</p>
        `;
        break;

      case 'aprobado':
        subject = '¡Tu crédito fue aprobado! - Rapicréditos';
        html = `
          <h2 style="color:#211652;">¡Felicitaciones ${persona.nombres}!</h2>
          <p>Tu solicitud de crédito ha sido <strong style="color:green;">aprobada</strong>.</p>
  
          ${
            data?.monto_aprobado
              ? `<p>Monto aprobado: <strong>$${data.monto_aprobado.toLocaleString(
                  'es-AR',
                )}</strong></p>`
              : ''
          }
  
          ${
            data?.cuotas
              ? `<p>Cantidad de cuotas: <strong>${data.cuotas}</strong></p>`
              : ''
          }
  
          <p>Ya puedes ver los detalles en tu cuenta.</p>
          <br>
          <p>Saludos,<br>Equipo de Rapicréditos</p>
        `;
        break;

      case 'rechazado':
        subject = 'Resultado de tu solicitud - Rapicréditos';
        html = `
          <h2 style="color:#211652;">Hola ${persona.nombres},</h2>
          <p>Lamentamos informarte que tu solicitud ha sido <strong style="color:#d40750;">rechazada</strong>.</p>
  
          <h3>Motivo:</h3>
          <p><strong>${data?.motivo_rechazo}</strong></p>
  
          <h3>Descripción:</h3>
          <p>${data?.mensaje_rechazo}</p>
  
          <p>Si deseas volver a aplicar o corregir tus datos, estamos para ayudarte.</p>
          <br>
          <p>Saludos,<br>Equipo de Rapicréditos</p>
        `;
        break;
    }

    // Enviar correo
    await transporter.sendMail({
      from: `"Rapicréditos" <${process.env.MAIL_USER}>`,
      to: persona.correo_electronico,
      subject,
      html,
    });
  }

  // Método específico para enviar código de verificación
  async enviarCodigoVerificacion(correo: string, codigo: string) {
    // Crear transporte
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const subject = 'Código de verificación - Rapicréditos';
    const html = `
      <div style="font-family: Arial, sans-serif; color:#222">
        <h2 style="color:#211652; margin-bottom: 0.2rem;">Verificación de correo</h2>
        <p>Tu código de verificación es:</p>
        <div style="display:inline-block; padding: 1rem 1.5rem; background:#f6f5fb; border-radius:8px; margin: 0.5rem 0;">
          <h1 style="letter-spacing:6px; margin:0; color:#211652;">${codigo}</h1>
        </div>
        <p>Este código expira en 10 minutos.</p>
        <p>Si no solicitaste este código, ignora este correo.</p>
        <br />
        <p>Saludos,<br/>Equipo Rapicréditos</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Rapicréditos" <${process.env.MAIL_USER}>`,
      to: correo,
      subject,
      html,
    });
  }
}
