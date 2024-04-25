import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {BadRequestException, INestApplication, ValidationPipe} from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { ErrorFilter } from './app.errors.filter';
import expressConfiguration from './config/express';
import { winstonOptions } from './config/winston';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { install as sourceMapSupportInit } from 'source-map-support';
import { config } from 'dotenv';
import { PRODUCTION } from './constants';

config();

const winstonLogger = WinstonModule.createLogger(winstonOptions());

async function createApp() {
  sourceMapSupportInit();
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
    cors: true,
    bodyParser: false,
  });

  const httpAdapter = app.getHttpAdapter();
  const instance = httpAdapter.getHttpServer();
  instance.keepAliveTimeout = +process.env.KEEP_ALIVE_TIMEOUT_SECONDS || 65000;
  instance.headersTimeout = instance.keepAliveTimeout + 1000; // Ensure the headersTimeout is set higher than the keepAliveTimeout due to nodejs regression bug
  app.useGlobalPipes(
    new ValidationPipe({
      validationError: { target: false, value: false },
      exceptionFactory: (errors) => new BadRequestException(errors),
    })
  );
  app.useGlobalFilters(new ErrorFilter());

  if (!import.meta.env.PROD) {
    configureSwagger(app)
  }
  return app;
}

function configureSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Safekids')
    .setDescription('Safekids API')
    .setVersion('2.0')
    .addTag('safekids')
    .addBearerAuth().build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
}
async function bootstrap(app: INestApplication) {
  // get the port from configuration
  const {expressConfig} = expressConfiguration()
  const port = expressConfig.port;

  if (!port) {
    winstonLogger.error('There is not configuration defined with a port. Exiting');
  } else {
    await app.listen(port);
    winstonLogger.log(`Application is running on: ${await app.getUrl()}`);
  }
}

const appPromise = createApp()

if (import.meta.env.PROD) {
  async function init() {
    const app = await appPromise
    await bootstrap(app)
  }
  init()
}

export const viteNodeApp = appPromise;
