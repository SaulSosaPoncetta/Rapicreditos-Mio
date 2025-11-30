import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Administrador } from '../administrador/entities/administrador.entity';

async function runSeed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const adminRepo = app.get<Repository<Administrador>>(
    getRepositoryToken(Administrador),
  );

  const mail = process.env.SEED_ADMIN_MAIL || 'admin@rapicreditos.com';
  const plainPassword = process.env.SEED_ADMIN_PASS || 'Rapicreditos1234@';

  const existing = await adminRepo.findOne({
    where: { correo_electronico: mail },
  });

  if (existing) {
    console.log('Administrador ya existe - seed omitido');
  } else {
    const hashed = await bcrypt.hash(plainPassword, 10);
    const admin = adminRepo.create({
      correo_electronico: mail,
      contrasenia: hashed,
      nombres: 'Juan',
      apellidos: 'Pérez',
    });
    await adminRepo.save(admin);
    console.log('Administrador creado:', mail);
  }

  process.exit();
}

runSeed();
