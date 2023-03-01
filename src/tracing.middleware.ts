import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { X_REQUEST_ID_HEADER, X_RESPONSE_ID_HEADER } from './constants';

@Injectable()
export class TracingMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const uuid = req.header(X_REQUEST_ID_HEADER) ?? randomUUID();
    try {
      const { Logger } = await import('gc-json-logger');
      Logger.setLogger(new Logger(uuid));
      /* c8 ignore next */
    } catch {} /* eslint-disable-line no-empty */
    res.setHeader(X_RESPONSE_ID_HEADER, uuid);
    next();
  }
}
