import { RouteInfo } from '@nestjs/common/interfaces';

export interface TracingModuleOptions {
  routes: (string | RouteInfo)[];
  excludedRoutes?: (string | RouteInfo)[];
  configure?(id: string): void | Promise<void>;
}
