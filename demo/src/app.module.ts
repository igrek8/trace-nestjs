import { Controller, Module, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { LoggerModule, LoggerService } from 'gc-json-logger-nestjs';
import { Traceable, TracingModule } from 'trace-nestjs';

@Controller()
@Traceable() // adds headers definition for your OpenAPI
export class AppController {
  constructor(protected readonly logger: LoggerService) {}

  @Post('/trace')
  @ApiResponse({ type: String })
  demo() {
    // logger logs as x-request-id in "logging.googleapis.com/operation"."id"
    this.logger.info('do work');
    return 'data';
  }
}

@Module({
  imports: [
    TracingModule.register({
      // specify which routes to trace
      routes: ['*'],
    }),
    LoggerModule.register({
      // specify which routes to log
      routes: ['*'],
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
