import { Controller, Module, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { LoggerModule, LoggerService } from 'gc-json-logger-nestjs';
import { Trace, TracingModule } from 'trace-nestjs';

@Controller()
export class AppController {
  constructor(protected readonly logger: LoggerService) {}

  @Post('/trace')
  @Trace() // adds headers definition for your OpenAPI
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
