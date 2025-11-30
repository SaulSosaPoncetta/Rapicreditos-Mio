import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AdministradorService } from './administrador.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/roles/role.decorator';

import { RechazarPostulanteDto } from './dto/rechazar-postulante.dto';
import { AprobarPostulanteDto } from './dto/aprobar-postulante.dto';
import { UpdateAdministradorDto } from './dto/update-administrador.dto';
import { RegistrarPagoDto } from './dto/registrar-pago.dto';

@Controller('rapicreditos/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdministradorController {
  constructor(private readonly adminService: AdministradorService) {}

  // -------------------------------------
  //  ADMIN INFO
  // -------------------------------------
  @Role('ADMIN')
  @Post('creditos/:id/recalcular-mora')
  async recalcularMora(
    @Param('id') id: number,
    @Query('testDays') testDays: number = 0,
  ) {
    return this.adminService.recalcularMora(Number(id), Number(testDays));
  }

  @Get('info')
  @Role('ADMIN')
  getInfoAdmin() {
    return this.adminService.getInfoAdmin();
  }

  @Patch('/update')
  @Role('ADMIN')
  updateInfoAdmin(@Body() body: UpdateAdministradorDto) {
    return this.adminService.updateInfoAdmin(1, body); // admin único
  }

  // -------------------------------------
  //  POSTULANTES
  // -------------------------------------

  @Get('postulantes')
  @Role('ADMIN')
  getPostulantes() {
    return this.adminService.getPostulantes();
  }

  @Patch('postulantes/:id/rechazar')
  @Role('ADMIN')
  rechazarPostulante(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: RechazarPostulanteDto,
  ) {
    return this.adminService.rechazarPostulante(id, body);
  }

  @Patch('postulantes/:id/aprobar')
  @Role('ADMIN')
  aprobarPostulante(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AprobarPostulanteDto,
  ) {
    return this.adminService.aprobarPostulante(id, body);
  }

  // -------------------------------------
  // CLIENTES
  // -------------------------------------

  @Get('clientes')
  @Role('ADMIN')
  getClientes() {
    return this.adminService.getClientes();
  }

  // -------------------------------------
  // CREDITOS
  // -------------------------------------

  @Get('creditos')
  @Role('ADMIN')
  getCreditos(@Query('page') page: string, @Query('limit') limit: string) {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    return this.adminService.getCreditos(pageNumber, limitNumber);
  }

  // OBTENER CREDITO POR ID
  @Get('creditos/:id')
  getCreditoById(@Param('id') id: string) {
    return this.adminService.getCreditoById(Number(id));
  }

  // OBTENER PAGOS POR CREDITO
  @Get('pagos/:id')
  getPagosByCredito(@Param('id') id: string) {
    return this.adminService.getPagosByCredito(Number(id));
  }

  @Patch('creditos/:id/aprobar')
  @Role('ADMIN')
  aprobarCredito(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.aprobarCredito(id);
  }

  // -------------------------------------
  // PAGOS
  // -------------------------------------

  @Get('pagos')
  @Role('ADMIN')
  getPagos(@Query('creditoId') creditoId?: string) {
    const id = creditoId ? Number(creditoId) : undefined;
    return this.adminService.getPagos(id);
  }

  @Post('pagos/registrar')
  @Role('ADMIN')
  registrarPago(@Body() body: RegistrarPagoDto) {
    return this.adminService.registrarPago(body);
  }

  // -------------------------------------
  // DASHBOARD
  // -------------------------------------

  @Get()
  @Role('ADMIN')
  getDashboardInfo() {
    return this.adminService.getDashboardInfo();
  }
}
