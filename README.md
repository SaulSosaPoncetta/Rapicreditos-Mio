# Rapicréditos – Backend (NestJS)

Sistema backend desarrollado con NestJS, pensado para gestionar el flujo completo de solicitudes de crédito, administración de usuarios, verificación de datos, manejo de pagos, contacto, notificaciones por correo y más.
Incluye autenticación, autorización por roles, subida de archivos, y persistencia mediante TypeORM.

# Estructura principal del proyecto
src/
│
├── administrador/     → Gestión de administradores del sistema
├── auth/              → Autenticación (JWT), login, protección de rutas
├── config/            → Configuración general (multer, etc.)
├── contacto/          → Mensajes de contacto enviados por clientes
├── credito/           → Solicitudes de crédito y su administración
├── mail/              → Servicio de email
├── pago/              → Gestión de pagos asociados a créditos
├── persona/           → Datos personales de los solicitantes
├── seed/              → Creación de usuario administrador inicial
├── verificacion/      → Validaciones y verificaciones de datos
│
├── app.module.ts
├── app.controller.ts
├── main.ts


Cada módulo incluye controladores, servicios, entidades y DTOs correspondientes.

# Funcionalidades principales
✔ Gestión de administradores

  Alta, modificación y eliminación

  Login

  Roles

  Manejo de credenciales

✔ Autenticación y autorización

  Login mediante JWT

  Guards de protección (AuthGuard, RolesGuard)

  Decoradores personalizados de roles

✔ Gestión de créditos

  Creación de solicitudes

  Actualización de estado

  Cálculo de cuotas (si aplica)

  Asociación con personas, pagos y verificaciones

✔ Personas

  Alta de solicitantes

  Actualización de datos

  Subida de imágenes/documentación (Multer)

✔ Pagos

  Registro de pagos

  Relación con créditos

  Entidades y DTOs completos

✔ Contacto

  Registro de mensajes enviados desde algún formulario de contacto

✔ Verificación

  Datos relacionados con validación de identidad y documentos

✔ Emails (Mail Service)

  Notificaciones automáticas mediante un módulo dedicado

✔ Seed

  Creación de un administrador inicial mediante script

# Tecnologías utilizadas

  # NestJS 10+
      npm install -g @nestjs/cli

  # TypeScript
      NestJS ya incluye TypeScript por defecto, pero si necesitás instalar manualmente:
      
      npm install typescript --save-dev
      npm install ts-node --save-dev

  # TypeORM
      npm install @nestjs/typeorm typeorm

  # MySQL / PostgreSQL / cualquier dialecto soportado
      npm install mysql2
      npm install pg
      npm install sqlite3
      npm install mariadb

  # JWT – Autenticación
      npm install @nestjs/jwt jsonwebtoken

  # bcrypt – Hash de contraseñas
      npm install bcrypt
      npm install --save-dev @types/bcrypt

  # Multer – Subida de archivos
      npm install @nestjs/platform-express multer

  # Nodemailer – Envío de emails
      npm install nodemailer

  # Dotenv – Manejo de variables de entorno
      npm install dotenv
      npm install @nestjs/config

# Requisitos previos
    Node.js 18+
    npm
    Base de datos MySQL / PostgreSQL
    Archivo .env configurado (ver sección siguiente)

# Archivo .env (ejemplo)
    Colocar en la raíz del proyecto:
 
  # Database
      DB_HOST=localhost
      DB_PORT=3306
      DB_USERNAME=root
      DB_PASSWORD=root
      DB_NAME=rapicreditos

  # JWT
      JWT_SECRET=supersecreto
      JWT_EXPIRES_IN=24h

  # Email
      MAIL_HOST=smtp.tu-servidor.com
      MAIL_PORT=587
      MAIL_USER=tu-correo
      MAIL_PASS=tu-pass
  # Uploads
      UPLOADS_DIR=uploads

# Instalación
    npm install

# Ejecutar en desarrollo
    npm run start:dev

# Ejecutar en producción
    npm run build
    npm run start:prod

# Scripts útiles

    npm run start → Arranca el servidor

    npm run start:dev → Modo desarrollo

    npm run test → Tests unitarios

    npm run test:e2e → Tests end-to-end

    npm run build → Compila la app

# Testing

    El proyecto incluye carpeta test/ para pruebas e2e:

test/
└── app.e2e-spec.ts


Se ejecutan mediante:

    npm run test:e2e

# Uploads

    Los archivos subidos (por ejemplo fotos de personas) se almacenan en:

    uploads/personas/


    Configurado a través de multer.config.ts.

# Arquitectura general

    Este backend sigue la arquitectura modular propuesta por NestJS:

    Controladores → manejo de rutas HTTP

    Servicios → lógica de negocio

    Módulos → delimitación de contextos

    Entidades (TypeORM) → representación de tablas

    DTOs → validación y tipado de datos entrantes

    Esto permite escalar agregando nuevos módulos sin afectar el resto del sistema.

# Seed inicial

    Para crear el administrador inicial:

    src/seed/seed-admin.ts


    Podés ejecutar manualmente el script o integrarlo a un comando.

# Licencia

    Este proyecto utiliza la licencia incluida en el repositorio:
    LICENSE

# Autor

    Proyecto desarrollado como backend para Rapicréditos.
    Tecnología: NestJS + TypeORM + JWT + Nodemailer.


<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```


## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Recursos

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Soporte

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Contactanos

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## Licencia

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

## Link UML Base de Datos

**https://drive.google.com/file/d/13k4lAhi2Z7u92tnXuNEbCy5lbpSLFG-j/view?usp=sharing**

## Link Trello

## Link Figma.