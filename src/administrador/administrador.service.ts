// src/administrador/administrador.service.ts
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Persona } from '../persona/entities/persona.entity';
import {
  Credito,
  EstadoCreditoEnum,
  InteresCreditoEnum,
  TipoCreditoEnum,
} from '../credito/entities/credito.entity';
import { Pago } from '../pago/entities/pago.entity';
import { Cuota } from 'src/cuota/entities/cuota.entity';
import { Administrador } from './entities/administrador.entity';
import { PersonaFrontDto } from './dto/persona-front-dto';
import { MailService } from 'src/mail/mail.service';
import { UpdateAdministradorDto } from './dto/update-administrador.dto';
import { RegistrarPagoDto } from './dto/registrar-pago.dto';
import { standardResponse } from 'src/common/utils/response.util';
import { AprobarPostulanteDto } from './dto/aprobar-postulante.dto';
import { RechazarPostulanteDto } from './dto/rechazar-postulante.dto';

@Injectable()
export class AdministradorService {
  constructor(
    @InjectRepository(Persona)
    private readonly personaRepo: Repository<Persona>,
    private readonly mailService: MailService,

    @InjectRepository(Credito)
    private readonly creditoRepo: Repository<Credito>,

    @InjectRepository(Pago)
    private readonly pagoRepo: Repository<Pago>,

    @InjectRepository(Cuota)
    private readonly cuotaRepo: Repository<Cuota>,

    @InjectRepository(Administrador)
    private readonly adminRepo: Repository<Administrador>,
  ) {}

  // =========================
  // ADMIN INFO
  // =========================
  async getInfoAdmin(): Promise<{
    statusCode: number;
    msg: string;
    data: Partial<Administrador>;
  }> {
    try {
      const admin = await this.adminRepo.findOne({
        where: { id_administrador: 1 },
      }); // Solo hay uno
      if (!admin) throw new NotFoundException('Administrador no encontrado');

      const { contrasenia, ...adminSinPassword } = admin;

      return standardResponse(
        HttpStatus.OK,
        'Administrador obtenido correctamente',
        adminSinPassword,
      );
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error al obtener administrador',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateInfoAdmin(id_admin: number, dto: UpdateAdministradorDto) {
    try {
      const admin = await this.adminRepo.findOne({
        where: { id_administrador: id_admin },
      });

      if (!admin) {
        throw new HttpException(
          'Administrador no encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      // Cambio de correo_electronico
      if (dto.correo_electronico) {
        // Verificar si es el mismo correo electronico
        if (dto.correo_electronico === admin.correo_electronico) {
          throw new HttpException(
            'El nuevo correo electrónico no puede ser igual al anterior.',
            HttpStatus.BAD_REQUEST,
          );
        }

        admin.correo_electronico = dto.correo_electronico;
      }

      // Cambio de contraseña
      if (dto.contrasenia) {
        // Verificar si es la misma contraseña
        const esLaMisma = await bcrypt.compare(
          dto.contrasenia,
          admin.contrasenia,
        );

        if (esLaMisma) {
          throw new HttpException(
            'La nueva contraseña no puede ser igual a la anterior.',
            HttpStatus.BAD_REQUEST,
          );
        }

        // Generar nueva contraseña hasheada
        const hash = await bcrypt.hash(dto.contrasenia, 10);
        admin.contrasenia = hash;
      }

      // Guardar cambios
      const saved = await this.adminRepo.save(admin);
      const { contrasenia, ...sinPass } = saved;

      return standardResponse(
        HttpStatus.OK,
        'Administrador actualizado correctamente',
        sinPass,
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new HttpException(
        'Error interno en administrador',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // =========================
  // POSTULANTES (CREACION, RECHAZO, APROBACION)
  // =========================
  async getPostulantes() {
    const personas = await this.personaRepo.find({
      where: { estado_postulante: true },
      relations: ['creditos'],
    });
    if (!personas.length)
      return standardResponse(
        HttpStatus.OK,
        'No hay postulantes registrados',
        [],
      );

    const data = personas.map(this.mapPersonaForFront);
    return standardResponse(
      HttpStatus.OK,
      'Postulantes obtenidos correctamente',
      data,
    );
  }

  async rechazarPostulante(id: number, dto: RechazarPostulanteDto) {
    const persona = await this.personaRepo.findOne({
      where: { id_persona: id },
      relations: ['creditos'],
    });
    if (!persona) throw new NotFoundException('Postulante no encontrado');

    const creditoPendiente = persona.creditos.find(
      (c) => c.estado_credito === EstadoCreditoEnum.PENDIENTE,
    );
    if (!creditoPendiente)
      throw new HttpException(
        'La persona no tiene un crédito pendiente',
        HttpStatus.BAD_REQUEST,
      );

    persona.estado_postulante = false;
    persona.cliente = false;
    persona.creditos_activos = false;
    persona.estado_solicitud = 'rechazado';
    persona.motivo_rechazo = dto.motivo_rechazo;
    persona.mensaje_rechazo = dto.mensaje_rechazo;

    creditoPendiente.estado_credito = EstadoCreditoEnum.RECHAZADO;

    await this.personaRepo.save(persona);
    await this.creditoRepo.save(creditoPendiente);

    await this.mailService.enviarCorreoNotificacion(persona, 'rechazado', {
      motivo_rechazo: dto.motivo_rechazo,
      mensaje_rechazo: dto.mensaje_rechazo,
    });

    return standardResponse(
      HttpStatus.OK,
      'Solicitud rechazada correctamente',
      { id_persona: id },
    );
  }

  async aprobarPostulante(id: number, dto: AprobarPostulanteDto) {
    const persona = await this.personaRepo.findOne({
      where: { id_persona: id },
      relations: ['creditos'],
    });

    if (!persona) throw new NotFoundException('Postulante no encontrado');

    const creditoPendiente = persona.creditos.find(
      (c) => c.estado_credito === EstadoCreditoEnum.PENDIENTE,
    );
    if (!creditoPendiente)
      throw new HttpException(
        'La persona no tiene un crédito pendiente',
        HttpStatus.BAD_REQUEST,
      );

    creditoPendiente.estado_credito = EstadoCreditoEnum.APROBADO;
    await this.creditoRepo.save(creditoPendiente);

    const nuevasCuotas = this.generarCuotas(creditoPendiente);
    await this.cuotaRepo.save(nuevasCuotas);

    creditoPendiente.estado_credito = EstadoCreditoEnum.ACTIVO;
    await this.creditoRepo.save(creditoPendiente);

    persona.estado_postulante = false;
    persona.cliente = true;
    persona.creditos_activos = true;
    persona.estado_solicitud = 'aprobado';
    await this.personaRepo.save(persona);

    try {
      await this.mailService.enviarCorreoNotificacion(persona, 'aprobado', {
        monto_aprobado: dto.monto_aprobado,
        cuotas: dto.cuotas,
      });
    } catch (mailErr) {
      console.error('[MAIL ERROR] => ', mailErr);
      return standardResponse(
        HttpStatus.OK,
        'Aprobación correcta, pero error al enviar correo',
        { id_persona: id },
      );
    }

    return standardResponse(
      HttpStatus.OK,
      'Postulante y crédito aprobados correctamente',
      { id_persona: id },
    );
  }

  // -------------------------
  // CLIENTES
  // -------------------------
  async getClientes() {
    const personas = await this.personaRepo.find({
      where: { estado_postulante: false, cliente: true },
      relations: ['creditos'],
    });
    const data = personas.map(this.mapPersonaForFront);
    return standardResponse(
      HttpStatus.OK,
      'Clientes obtenidos correctamente',
      data,
    );
  }

  // Creditos Listados
  async getCreditos(page = 1, limit = 10) {
    const [creditos, total] = await this.creditoRepo.findAndCount({
      where: { estado_credito: EstadoCreditoEnum.ACTIVO },
      relations: ['persona', 'pagos', 'cuotas'],
      skip: (page - 1) * limit,
      take: limit,
      order: { fecha_solicitud: 'DESC' },
    });

    const data = creditos.map((c) => ({
      id_credito: c.id_credito,
      tipo_credito: c.tipo_credito,
      monto_solicitado: Number(c.monto_solicitado),
      cantidad_cuotas: c.cantidad_cuotas,
      fecha_solicitud: c.fecha_solicitud,
      estado: c.estado_credito,
      persona: c.persona
        ? {
            id_persona: c.persona.id_persona,
            nombres: c.persona.nombres,
            apellidos: c.persona.apellidos,
            dni: c.persona.dni,
            telefono: c.persona.telefono,
            correo_electronico: c.persona.correo_electronico,
          }
        : null,
      pagos: (c.pagos || []).map((p) => ({
        id_pago: p.id_pago,
        monto_cuota: Number(p.monto_cuota),
        fecha_pago: p.fecha_pago,
        mensaje: p.mensaje ?? null,
        cuota: p.cuota ?? null,
      })),
      cuotas: (c.cuotas || []).map((q) => ({
        id_cuota: q.id_cuota,
        numero: q.numero,
        monto_total: Number(q.monto_total),
        monto_pagado: Number(q.monto_pagado),
        fecha_vencimiento: q.fecha_vencimiento,
        pagada: q.pagada,
        en_mora: q.en_mora,
        dias_mora: q.dias_mora,
        monto_mora: Number(q.monto_mora),
      })),
    }));

    return {
      statusCode: HttpStatus.OK,
      msg: 'Créditos obtenidos correctamente',
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // =======================================================
  // 2) OBTENER CRÉDITO POR ID (CON MORA Y CUOTAS)
  // =======================================================
  async getCreditoById(id: number) {
    const credito = await this.creditoRepo.findOne({
      where: { id_credito: id },
      relations: ['persona', 'cuotas', 'pagos'],
    });

    if (!credito) {
      throw new NotFoundException(`Crédito ID ${id} no encontrado`);
    }

    // Recalcular mora dinámica
    await this.aplicarMoraIndividual(credito);

    const data = {
      ...credito,
      cuotas: credito.cuotas.map((c) => ({
        id_cuota: c.id_cuota,
        numero: c.numero,
        fecha_vencimiento: c.fecha_vencimiento,
        monto_total: Number(c.monto_total),
        monto_pagado: Number(c.monto_pagado),
        pagada: c.pagada,
        en_mora: c.en_mora,
        dias_mora: c.dias_mora,
        monto_mora: Number(c.monto_mora),
      })),
      pagos: credito.pagos.map((p) => ({
        id_pago: p.id_pago,
        monto_cuota: Number(p.monto_cuota),
        fecha_pago: p.fecha_pago,
        mensaje: p.mensaje,
        cuota: p.cuota?.numero ?? null,
      })),
    };

    return standardResponse(HttpStatus.OK, 'Crédito obtenido', data);
  }

  async recalcularMora(id_credito: number, testDays: number = 0) {
    const credito = await this.creditoRepo.findOne({
      where: { id_credito },
      relations: ['cuotas'],
    });

    if (!credito) {
      throw new NotFoundException('Crédito no encontrado');
    }

    // Aplicar la lógica real de mora
    await this.aplicarMoraIndividual(credito, testDays);

    // Guardar cambios en cuotas
    await this.cuotaRepo.save(credito.cuotas);

    return {
      status: 'OK',
      message: `Mora recalculada correctamente con testDays=${testDays}`,
      credito,
    };
  }

  // =======================================================
  // 3) OBTENER PAGOS DE UN CRÉDITO
  // =======================================================
  async getPagosByCredito(creditoId: number) {
    const pagos = await this.pagoRepo.find({
      where: { credito: { id_credito: creditoId } },
      relations: ['cuota'],
      order: { fecha_pago: 'DESC' },
    });

    return standardResponse(HttpStatus.OK, 'Pagos obtenidos', pagos);
  }

  /**
   * registrarPago: maneja la lógica de validar cuota, calcular mora mensual obligatoria (10% por mes vencido),
   * crear el pago, actualizar cuota y crédito. Usa queryRunner (transacción) para consistencia.
   */
  async registrarPago(dto: RegistrarPagoDto) {
    return await this.pagoRepo.manager.transaction(async (manager) => {
      const { personaId, monto, mensaje, creditoId, cuota } = dto;

      const pagoRepo = manager.getRepository(Pago);
      const cuotaRepo = manager.getRepository(Cuota);
      const creditoRepo = manager.getRepository(Credito);
      const personaRepo = manager.getRepository(Persona);

      const persona = await personaRepo.findOne({
        where: { id_persona: personaId },
      });

      if (!persona) {
        throw new NotFoundException('Persona no encontrada');
      }

      const credito = await creditoRepo.findOne({
        where: { id_credito: creditoId },
        relations: ['cuotas'],
      });

      if (!credito) {
        throw new NotFoundException('Crédito no encontrado');
      }

      const cuotaEntity = credito.cuotas.find((c) => c.numero === cuota);

      if (!cuotaEntity) {
        throw new NotFoundException(`La cuota ${cuota} no existe`);
      }

      // Aplicar mora antes
      await this.aplicarMoraIndividual(credito);
      await cuotaRepo.save(credito.cuotas);

      // Recargar cuota actualizada
      const cuotaActualizada = credito.cuotas.find((c) => c.numero === cuota);

      if (!cuotaActualizada) {
        throw new Error(
          'No se pudo actualizar la cuota después de aplicar mora.',
        );
      }

      const totalConMora =
        Number(cuotaActualizada.monto_total) +
        Number(cuotaActualizada.monto_mora);

      if (Number(monto) < totalConMora) {
        throw new BadRequestException(
          `Monto insuficiente. Debe pagar al menos ${totalConMora}`,
        );
      }

      // Crear pago (ya no da error porque monto_mora existe en Pago)
      const nuevoPago = pagoRepo.create({
        monto_cuota: monto,
        monto_mora: cuotaActualizada.monto_mora,
        fecha_pago: new Date(),
        mensaje: mensaje ?? undefined,
        cuota: cuotaActualizada,
        persona,
        credito,
      });

      await pagoRepo.save(nuevoPago);

      // Actualizar cuota
      cuotaActualizada.pagada = true;
      cuotaActualizada.fecha_pago = new Date();
      cuotaActualizada.monto_pagado = totalConMora;

      // Reset mora
      cuotaActualizada.en_mora = false;
      cuotaActualizada.dias_mora = 0;
      cuotaActualizada.monto_mora = 0;

      await cuotaRepo.save(cuotaActualizada);

      // Ver si todas están pagadas
      const todasPagadas = credito.cuotas.every((c) => c.pagada);

      if (todasPagadas) {
        credito.estado_credito = EstadoCreditoEnum.FINALIZADO;
        await creditoRepo.save(credito);
      }

      return {
        message: 'Pago registrado correctamente con mora incluida',
        pago: nuevoPago,
        total_pagado: totalConMora,
      };
    });
  }

  // Listar pagos
  async getPagos(creditoId?: number) {
    try {
      let pagos: Pago[] = [];

      if (creditoId) {
        pagos = await this.pagoRepo.find({
          where: { credito: { id_credito: creditoId } },
          relations: ['persona', 'credito', 'cuota'],
          order: { fecha_pago: 'DESC' },
        });
      } else {
        pagos = await this.pagoRepo.find({
          relations: ['persona', 'credito', 'cuota'],
          order: { fecha_pago: 'DESC' },
        });
      }

      const data = pagos.map((p) => ({
        id_pago: p.id_pago,
        monto_cuota: Number(p.monto_cuota),
        fecha_pago: p.fecha_pago,
        mensaje: p.mensaje ?? null,
        persona: p.persona
          ? {
              id_persona: p.persona.id_persona,
              nombres: p.persona.nombres,
              apellidos: p.persona.apellidos,
              dni: p.persona.dni,
            }
          : null,
        credito: p.credito
          ? {
              id_credito: p.credito.id_credito,
              tipo_credito: p.credito.tipo_credito,
            }
          : null,
        cuota: p.cuota
          ? {
              id_cuota: p.cuota.id_cuota,
              numero: p.cuota.numero,
              monto_total: Number(p.cuota.monto_total),
              pagada: p.cuota.pagada,
            }
          : null,
      }));

      return standardResponse(
        HttpStatus.OK,
        creditoId
          ? 'Pagos del crédito obtenidos correctamente'
          : 'Pagos obtenidos correctamente',
        data,
      );
    } catch (error) {
      console.error('[getPagos] error => ', error);
      throw new HttpException(
        'Error al obtener los pagos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Helper
  private generarCuotas(credito: Credito) {
    const cuotas: Cuota[] = [];
    const montoTotal = Number(credito.monto_solicitado);
    const cantidad = Number(credito.cantidad_cuotas);

    // Mapear correctamente tipo_credito al interés
    const interesMap: Record<TipoCreditoEnum, number> = {
      [TipoCreditoEnum.PERSONAL]: InteresCreditoEnum.PERSONAL,
      [TipoCreditoEnum.PYME]: InteresCreditoEnum.PYME,
      [TipoCreditoEnum.AUTOMOTOR]: InteresCreditoEnum.AUTOMOTOR,
    };

    const interes = interesMap[credito.tipo_credito];
    if (interes === undefined) {
      throw new Error(
        `Tipo de crédito inválido: ${credito.tipo_credito}. No se puede calcular interés.`,
      );
    }

    const totalConInteres = montoTotal * (1 + interes);
    const base = Math.floor((totalConInteres / cantidad) * 100) / 100;

    let acumulado = 0;

    for (let i = 1; i <= cantidad; i++) {
      const monto =
        i === cantidad
          ? Number((totalConInteres - acumulado).toFixed(2))
          : base;

      acumulado += monto;

      const fecha = new Date();
      fecha.setMonth(fecha.getMonth() + i);

      // Ajuste para el último día del mes
      if (fecha.getDate() !== new Date().getDate()) {
        fecha.setDate(0);
      }

      const nuevaCuota = this.cuotaRepo.create({
        numero: i,
        monto_total: monto,
        monto_pagado: 0,
        fecha_vencimiento: fecha,
        pagada: false,
        en_mora: false,
        dias_mora: 0,
        monto_mora: 0,
        credito: credito,
      });

      cuotas.push(nuevaCuota);
    }

    return cuotas;
  }

  // Calcula y aplica mora a cada cuota de un crédito usando días reales.
  private async aplicarMoraIndividual(credito: Credito, testDays: number = 0) {
    const hoy = new Date();

    if (testDays > 0) {
      hoy.setDate(hoy.getDate() + testDays);
      console.log('Modo test — Fecha simulada:', hoy);
    }

    for (const cuota of credito.cuotas) {
      const venc = new Date(cuota.fecha_vencimiento);

      if (venc < hoy && !cuota.pagada) {
        const diffTime = hoy.getTime() - venc.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        cuota.en_mora = diffDays > 0;
        cuota.dias_mora = diffDays;

        const tasaDiaria = 0.001; // 0.1% diario
        cuota.monto_mora = Number(cuota.monto_total) * tasaDiaria * diffDays;
      } else {
        cuota.en_mora = false;
        cuota.dias_mora = 0;
        cuota.monto_mora = 0;
      }
    }

    // Guardamos los datos en la tabla Cuotas
    await this.cuotaRepo.save(credito.cuotas);
  }

  // Listar creditos pendientes
  async getCreditosPendientes() {
    try {
      const creditos = await this.creditoRepo.find({
        where: { estado_credito: EstadoCreditoEnum.PENDIENTE },
        relations: ['persona', 'cuotas'],
      });

      const data = creditos.map((c) => ({
        id_credito: c.id_credito,
        tipo_credito: c.tipo_credito,
        monto_solicitado: Number(c.monto_solicitado),
        cantidad_cuotas: c.cantidad_cuotas,
        fecha_solicitud: c.fecha_solicitud,
        estado: 'Evaluación',
        persona: {
          id_persona: c.persona?.id_persona ?? null,
          nombres: c.persona?.nombres ?? null,
          apellidos: c.persona?.apellidos ?? null,
          dni: c.persona?.dni ?? null,
          telefono: c.persona?.telefono ?? null,
          correo_electronico: c.persona?.correo_electronico ?? null,
        },
      }));

      return {
        statusCode: HttpStatus.OK,
        msg: 'Créditos pendientes obtenidos correctamente',
        data,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error al obtener créditos pendientes',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Aprobar credito por id (útil si querés aprobar crédito ya creado)
  async aprobarCredito(id: number) {
    try {
      const credito = await this.creditoRepo.findOne({
        where: { id_credito: id },
        relations: ['persona', 'cuotas'],
      });

      if (!credito) throw new NotFoundException('Crédito no encontrado');

      // Si aún es PENDIENTE, pasarlo a APROBADO -> ACTIVO y generar cuotas si no hay
      credito.estado_credito = EstadoCreditoEnum.APROBADO;
      await this.creditoRepo.save(credito);

      // generar cuotas solo si no existen
      const cuotasExistentes = await this.cuotaRepo.find({
        where: { credito: { id_credito: credito.id_credito } },
      });
      if (!cuotasExistentes || cuotasExistentes.length === 0) {
        const nuevas = this.generarCuotas(credito);
        await this.cuotaRepo.save(nuevas);
      }

      // marcar activo
      credito.estado_credito = EstadoCreditoEnum.ACTIVO;
      await this.creditoRepo.save(credito);

      // Marcar persona como cliente / actualizar estado de cuenta
      if (credito.persona) {
        credito.persona.estado_cuenta_cliente = 'Al día';
        credito.persona.cliente = true;
        credito.persona.creditos_activos = true;
        await this.personaRepo.save(credito.persona);
      }

      return {
        statusCode: HttpStatus.OK,
        msg: 'Crédito aprobado correctamente',
        data: { id_credito: id },
      };
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        'Error al aprobar crédito',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Dashboard
  async getDashboardInfo() {
    try {
      const totalPostulantes = await this.personaRepo.count({
        where: { estado_postulante: true },
      });

      const totalClientes = await this.personaRepo.count({
        where: { cliente: true },
      });

      const creditosPendientes = await this.creditoRepo.count({
        where: { estado_credito: EstadoCreditoEnum.PENDIENTE },
      });

      const totalCreditos = await this.creditoRepo.count();

      return {
        statusCode: HttpStatus.OK,
        msg: 'Información de dashboard obtenida',
        data: {
          totalPostulantes,
          totalClientes,
          creditosPendientes,
          totalCreditos,
        },
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error al obtener dashboard',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Mapper
  private mapPersonaForFront(p: Persona): PersonaFrontDto {
    const dto = new PersonaFrontDto();

    const sueldoFormatted = p.sueldo
      ? `$${Number(p.sueldo).toLocaleString('es-AR')}`
      : 'No informado';

    const creditosFormatted = Array.isArray(p.creditos)
      ? p.creditos.map((c) => ({
          id_credito: c.id_credito,
          tipo_credito: c.tipo_credito,
          monto_solicitado: Number(c.monto_solicitado),
          cantidad_cuotas: c.cantidad_cuotas,
          estado_credito: c.estado_credito,
          fecha_solicitud: c.fecha_solicitud
            ? c.fecha_solicitud.toISOString()
            : '',
        }))
      : [];

    Object.assign(dto, {
      id_persona: p.id_persona,
      nombres: p.nombres,
      apellidos: p.apellidos,
      dni: p.dni,
      nro_de_tramite: p.nro_de_tramite,
      telefono: p.telefono,
      correo_electronico: p.correo_electronico,
      direccion: p.direccion,
      nro_direccion: p.nro_direccion,
      piso: p.piso ?? undefined,
      dpto: p.dpto ?? undefined,
      sueldo: sueldoFormatted,

      estado_cuenta_cliente: p.estado_cuenta_cliente,
      estado_postulante: p.estado_postulante,

      creditos: creditosFormatted,
      foto_dni_frente: p.foto_dni_frente,
      foto_dni_dorso: p.foto_dni_dorso,
      foto_recibo_sueldo: p.foto_recibo_sueldo,
      foto_selfie_dni_en_mano: p.foto_selfie_dni_en_mano,
    });

    return dto;
  }
}
