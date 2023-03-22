import { Controller, Get, INestApplication } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import * as request from 'supertest';
import { X_REQUEST_ID_HEADER } from './constants';
import { Trace } from './trace.decorator';
import { TracingModule } from './tracing.module';

jest.useFakeTimers();
jest.setSystemTime(0);

jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomUUID: jest.fn(),
}));

@Controller()
class TestController {
  @Get('/trace')
  @Trace()
  @ApiResponse({ type: 'string' })
  trace() {
    return 'traceable';
  }

  @Get('/no-trace')
  @ApiResponse({ type: 'string' })
  noTrace() {
    return 'non traceable';
  }
}

describe('LoggerModule', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TracingModule.register({
          routes: ['*'],
          excludedRoutes: ['/no-trace'],
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
    expect(res.get('x-response-id')).toBe('00000000-0000-0000-0000-000000000000');
  });

  it('sets x-response-id', async () => {
    const res = await request(app.getHttpServer()).get('/trace').set(X_REQUEST_ID_HEADER, 'test');
    expect(res.headers['x-response-id']).toBe('test');
  });

  it('excludes routes', async () => {
    (randomUUID as jest.MockedFunction<typeof randomUUID>).mockReturnValue('00000000-0000-0000-0000-000000000000');
    const res = await request(app.getHttpServer()).get('/no-trace');
    expect(res.headers['x-response-id']).toBe(undefined);
  });
});
