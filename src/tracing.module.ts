import { Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TracingMiddleware } from './tracing.middleware';
import { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE } from './tracing.module-definition';

@Module({})
export class TracingModule extends ConfigurableModuleClass implements NestModule {
  constructor(@Inject(MODULE_OPTIONS_TOKEN) protected readonly options: typeof OPTIONS_TYPE) {
    super();
  }

  configure(consumer: MiddlewareConsumer) {
    const config = consumer.apply(TracingMiddleware);
    if (this.options.excludedRoutes) config.exclude(...this.options.excludedRoutes);
    config.forRoutes(...this.options.routes);
  }
}
