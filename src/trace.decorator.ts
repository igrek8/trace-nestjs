import { applyDecorators } from '@nestjs/common';
import { ApiHeader, ApiHeaderOptions, ApiResponseMetadata } from '@nestjs/swagger';
import { DECORATORS } from '@nestjs/swagger/dist/constants';
import { HeadersObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { X_REQUEST_ID_HEADER, X_RESPONSE_ID_HEADER } from './constants';

const X_REQUEST_ID_HEADER_DEFINITION: ApiHeaderOptions = {
  name: X_REQUEST_ID_HEADER,
  required: false,
  description: 'Optional ID for tracing and issue reporting',
  example: '00000000-0000-0000-0000-000000000000',
  schema: { type: 'string', format: 'uuid' },
};

const X_RESPONSE_ID_HEADER_DEFINITION: HeadersObject = {
  [X_RESPONSE_ID_HEADER]: {
    required: true,
    description: 'Response ID for tracing and issue reporting',
    example: '00000000-0000-0000-0000-000000000000',
    schema: { type: 'string', format: 'uuid' },
  },
};

function ApiResponseHeader(): MethodDecorator {
  return <T>(
    _target: object,
    _propertyKey: string | symbol,
    descriptor?: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> | void => {
    if (descriptor?.value) {
      const responses: Record<string, ApiResponseMetadata> | undefined = Reflect.getMetadata(
        DECORATORS.API_RESPONSE,
        descriptor.value
      );
      if (responses) {
        Reflect.defineMetadata(
          DECORATORS.API_RESPONSE,
          Object.entries(responses).reduce<Record<string, ApiResponseMetadata>>((obj, [key, value]) => {
            obj[key] = {
              ...value,
              headers: {
                ...X_RESPONSE_ID_HEADER_DEFINITION,
                ...value.headers,
              },
            };
            return obj;
          }, {}),
          descriptor.value
        );
      }
    }
  };
}

export function Trace(): MethodDecorator {
  return applyDecorators(ApiHeader(X_REQUEST_ID_HEADER_DEFINITION), ApiResponseHeader());
}
