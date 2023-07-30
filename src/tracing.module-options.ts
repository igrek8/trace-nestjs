import { RouteInfo } from '@nestjs/common/interfaces';
import { NextFunction } from 'express';

export interface TracingModuleOptions {
  routes: (string | RouteInfo)[];
  excludedRoutes?: (string | RouteInfo)[];
  onRequest?(uuid: string, next: NextFunction): void;
}
