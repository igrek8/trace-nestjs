import { Controller, Get, INestApplication } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { v4, validate } from 'uuid';
import { X_REQUEST_ID_HEADER } from './constants';
import { Traceable } from './traceable.decorator';
import { TracingModule } from './tracing.module';

jest.useFakeTimers();
jest.setSystemTime(0);

jest.mock('uuid', () => ({ v4: jest.fn(), validate: jest.fn() }));

@Controller()
class TestController {
  @Get('/traceable')
  @Traceable()
  @ApiResponse({ type: 'string' })
  traceable() {
    return 'traceable';
  }

  @Get('/non-traceable')
  @ApiResponse({ type: 'string' })
  nonTraceable() {
    return 'non traceable';
  }
}

describe('LoggerModule', () => {
  let app: INestApplication;

  const configure = jest.fn();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TracingModule.register({
          routes: ['*'],
          excludedRoutes: ['/non-traceable'],
          configure,
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
    (v4 as jest.MockedFunction<typeof v4>).mockReturnValue('uuid');
    (validate as jest.MockedFunction<typeof validate>).mockReturnValue(true);
    const res = await request(app.getHttpServer()).get('/traceable');
    expect(res.get('x-response-id')).toBe('uuid');
  });

  it('sets x-response-id', async () => {
    (validate as jest.MockedFunction<typeof validate>).mockReturnValue(true);
    const res = await request(app.getHttpServer()).get('/traceable').set(X_REQUEST_ID_HEADER, 'test');
    expect(res.headers['x-response-id']).toBe('test');
  });

  it('returns bad request if not uuid', async () => {
    (validate as jest.MockedFunction<typeof validate>).mockReturnValue(false);
    const res = await request(app.getHttpServer()).get('/traceable').set(X_REQUEST_ID_HEADER, 'test');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'Bad Request',
      message: `"${X_REQUEST_ID_HEADER}" header must contain a valid uuid`,
      statusCode: 400,
    });
  });

  it('excludes routes', async () => {
    (v4 as jest.MockedFunction<typeof v4>).mockReturnValue('uuid');
    (validate as jest.MockedFunction<typeof validate>).mockReturnValue(true);
    const res = await request(app.getHttpServer()).get('/non-traceable');
    expect(res.headers['x-response-id']).toBe(undefined);
  });
});
