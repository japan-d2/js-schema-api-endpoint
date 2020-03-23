import { defineSchema } from '@japan-d2/schema'
import { SchemaDefinition } from '@japan-d2/schema/lib/interfaces'

export interface EndpointSchemaRequestInput<
  Q = unknown,
  B = unknown,
  H = unknown
> {
  query?: (schema: SchemaDefinition<{}>) => SchemaDefinition<Q>;
  body?: (schema: SchemaDefinition<{}>) => SchemaDefinition<B>;
  headers?: (schema: SchemaDefinition<{}>) => SchemaDefinition<H>;
}

export interface EndpointSchemaResponseInput<B = unknown, H = unknown> {
  body?: (schema: SchemaDefinition<{}>) => SchemaDefinition<B>;
  headers?: (schema: SchemaDefinition<{}>) => SchemaDefinition<H>;
}

type Filter<F, T> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends F ? K : never
  }[keyof T]
>

export interface EndpointSchemaInput<
  RequestQuery,
  RequestBody,
  RequestHeaders,
  ResponseBody,
  ResponseHeaders
> {
  summary?: string;
  description?: string;
  request?: EndpointSchemaRequestInput<
    RequestQuery,
    RequestBody,
    RequestHeaders
  >;
  response?: EndpointSchemaResponseInput<ResponseBody, ResponseHeaders>;
}

export interface EndpointSchema<T, U> {
  summary?: string;
  description?: string;
  request: SchemaDefinition<T>;
  response: SchemaDefinition<U>;
}

export type EndpointRequest<Q, B, H> = Filter<
  object,
  {
    query: Q;
    body: B;
    headers: H;
  }
>

export type EndpointResponse<B, H> = {
  body: B;
  headers: H;
}

export interface KeyNameMap {
  request: {
    query: string;
    body: string;
    headers: string;
  };
  response: {
    body: string;
    headers: string;
  };
}

export const defaultKeyNameMap: KeyNameMap = {
  request: {
    query: 'query',
    body: 'body',
    headers: 'headers'
  },
  response: {
    body: 'body',
    headers: 'headers'
  }
}

export interface Options {
  keyNameMap: KeyNameMap;
}

export const defaultOptions: Options = {
  keyNameMap: defaultKeyNameMap
}

export function endpointSchemaFactory (baseOptions: Options) {
  return function endpointSchema<
    RequestQuery,
    RequestBody,
    RequestHeaders,
    ResponseBody,
    ResponseHeaders
  > (
    input: EndpointSchemaInput<
      RequestQuery,
      RequestBody,
      RequestHeaders,
      ResponseBody,
      ResponseHeaders
    >,
    options = baseOptions
  ): EndpointSchema<
    EndpointRequest<RequestQuery, RequestBody, RequestHeaders>,
    EndpointResponse<ResponseBody, ResponseHeaders>
  > {
    let request = defineSchema()

    if (input.request) {
      const { query, body, headers } = input.request

      if (query) {
        request = request.object(
          options.keyNameMap.request.query,
          query(defineSchema()),
          {
            additionalProperties: true
          }
        )
      }

      if (body) {
        request = request.object(
          options.keyNameMap.request.body,
          body(defineSchema()),
          {
            additionalProperties: false
          }
        )
      }

      if (headers) {
        request = request.object(
          options.keyNameMap.request.headers,
          headers(defineSchema()),
          {
            additionalProperties: true
          }
        )
      }
    }

    let response = defineSchema()

    if (input.response) {
      const { body, headers } = input.response

      if (body) {
        response = response.object(
          options.keyNameMap.response.body,
          body(defineSchema()),
          {
            additionalProperties: false
          }
        )
      }

      if (headers) {
        response = response.object(
          options.keyNameMap.response.headers,
          headers(defineSchema()),
          {
            additionalProperties: false
          }
        )
      }
    }

    return {
      summary: input.summary,
      description: input.description,
      request,
      response
    } as EndpointSchema<
      EndpointRequest<RequestQuery, RequestBody, RequestHeaders>,
      EndpointResponse<ResponseBody, ResponseHeaders>
    >
  }
}

export const endpointSchema = endpointSchemaFactory(defaultOptions)
