import { Controller, Get, INestApplication } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import * as request from 'supertest';
import { AsyncLocalStorage } from 'async_hooks';
import { X_REQUEST_ID_HEADER } from './constants';
import { Trace } from './trace.decorator';
import { TracingModule } from './tracing.module';

jest.useFakeTimers();
jest.setSystemTime(0);

jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomUUID: jest.fn(),
}));

const context = new AsyncLocalStorage<string>();

@Controller()
class TestController {
  @Get('/trace')
  @Trace()
  @ApiResponse({ type: 'string' })
  trace() {
    return {
      id: context.getStore(),
      path: '/trace',
    };
  }

  @Get('/no-trace')
  @ApiResponse({ type: 'string' })
  noTrace() {
    return {
      id: context.getStore(),
      path: '/no-trace',
    };
  }

  @Get('/default')
  @Trace()
  default() {
    return {
      id: context.getStore(),
      path: '/no-trace',
    };
  }
}

describe('LoggerModule', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TracingModule.register({
          routes: ['/default'],
        }),
        TracingModule.register({
          routes: ['/trace'],
          excludedRoutes: ['/no-trace'],
          onRequest(uuid, next) {
            context.run(uuid, () => {
              next();
            });
          },
        }),
      ],
      controllers: [TestController],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.listen(50000);
  });

  afterAll(async () => {
    await app.close();
  });

  it('uses x-request-id', async () => {
    (randomUUID as jest.MockedFunction<typeof randomUUID>).mockReturnValue('00000000-0000-0000-0000-000000000000');
    const res = await request(app.getHttpServer()).get('/trace');
    expect(res.body).toEqual({ id: '00000000-0000-0000-0000-000000000000', path: '/trace' });
    expect(res.get('x-response-id')).toBe('00000000-0000-0000-0000-000000000000');
  });

  it('sets x-response-id with a callback', async () => {
    const res = await request(app.getHttpServer()).get('/trace').set(X_REQUEST_ID_HEADER, 'test');
    expect(res.headers['x-response-id']).toBe('test');
  });

  it('sets x-response-id with a default callback', async () => {
    const res = await request(app.getHttpServer()).get('/default').set(X_REQUEST_ID_HEADER, 'default');
    expect(res.headers['x-response-id']).toBe('default');
  });

  it('excludes routes', async () => {
    (randomUUID as jest.MockedFunction<typeof randomUUID>).mockReturnValue('00000000-0000-0000-0000-000000000000');
    const res = await request(app.getHttpServer()).get('/no-trace');
    expect(res.body).toEqual({ id: undefined, path: '/no-trace' });
    expect(res.headers['x-response-id']).toBe(undefined);
  });
});
