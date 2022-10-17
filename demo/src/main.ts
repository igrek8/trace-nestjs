import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'gc-json-logger';
import { AdapterLoggerService } from 'gc-json-logger-nestjs';
import { AppModule } from './app.module';

const logger = new AdapterLoggerService(Logger.getLogger());

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger });
  const config = new DocumentBuilder().build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);
  await app.listen(3000);
}
bootstrap();
