import { Body, Controller, Module, Post } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ApiProperty, ApiResponse, DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IsString, IsNumber, Min, Max, IsNotEmpty } from 'class-validator';
import { Logger } from 'gc-json-logger';
import { Trace, TracingModule } from '../';

class Student {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @ApiProperty({ type: Number })
  @Min(18)
  @Max(100)
  @IsNumber()
  age!: number;
}

@Controller()
export class AppController {
  @Post('/students')
  @Trace() // 1) adds headers definition for your OpenAPI
  @ApiResponse({ type: String })
  registerPerson(@Body() newPerson: Student) {
    // 2) log something
    Logger.info('Registering', { newPerson });
    return { registed: true };
  }
}

@Module({
  imports: [
    TracingModule.register({
      // 3) specify which routes to trace
      routes: ['*'],
      onRequest(uuid, next) {
        Logger.runWith(new Logger(uuid), () => {
          next();
        });
      },
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
