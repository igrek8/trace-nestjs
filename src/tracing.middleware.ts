import { BadRequestException, Inject, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { v4, validate } from 'uuid';
import { X_REQUEST_ID_HEADER, X_RESPONSE_ID_HEADER } from './constants';
import { MODULE_OPTIONS_TOKEN, OPTIONS_TYPE } from './tracing.module-definition';

export class TracingMiddleware implements NestMiddleware {
  constructor(@Inject(MODULE_OPTIONS_TOKEN) protected readonly options: typeof OPTIONS_TYPE) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const uuid = req.header(X_REQUEST_ID_HEADER) ?? v4();

    if (!validate(uuid)) {
      const error = `"${X_REQUEST_ID_HEADER}" header must contain a valid uuid`;
      next(new BadRequestException(error));
      return;
    }

    res.setHeader(X_RESPONSE_ID_HEADER, uuid);
    await this.options.configure?.(uuid);
    next();
  }
}
