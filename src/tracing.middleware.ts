import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { X_REQUEST_ID_HEADER, X_RESPONSE_ID_HEADER } from './constants';
import { MODULE_OPTIONS_TOKEN, OPTIONS_TYPE } from './tracing.module-definition';

@Injectable()
export class TracingMiddleware implements NestMiddleware {
  constructor(@Inject(MODULE_OPTIONS_TOKEN) protected readonly options: typeof OPTIONS_TYPE) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { onRequest = (_, next) => next() } = this.options;
    const uuid = req.header(X_REQUEST_ID_HEADER) ?? randomUUID();
    res.setHeader(X_RESPONSE_ID_HEADER, uuid);
    onRequest(uuid, next);
  }
}
