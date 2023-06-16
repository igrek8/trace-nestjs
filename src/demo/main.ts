import { Controller, Logger, Module, Post } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ApiResponse, DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Trace, TracingModule } from '../';

@Controller()
export class AppController {
  protected readonly logger = new Logger(AppController.name);

  @Post()
  @Trace() // 1) adds headers definition for your OpenAPI
  @ApiResponse({ type: String })
  test() {
    // 2) log something
    this.logger.log('do work');
    return 'data';
  }
}

@Module({
  imports: [
    TracingModule.register({
      // 3) specify which routes to trace
      routes: ['*'],
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = new DocumentBuilder().build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);
  await app.listen(3000);
}

bootstrap();
