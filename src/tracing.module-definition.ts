import { ConfigurableModuleBuilder } from '@nestjs/common';
import { TracingModuleOptions } from './tracing.module-options';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE } =
  new ConfigurableModuleBuilder<TracingModuleOptions>().build();
