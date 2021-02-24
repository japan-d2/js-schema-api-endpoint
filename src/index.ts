import { defineObjectSchema, defineSchema, field } from '@japan-d2/schema'
import { SchemaDefinition, ObjectField } from '@japan-d2/schema/lib/interfaces'

export interface EndpointSchemaRequestInput<
  Q = unknown,
  B = unknown,
  H = unknown
> {
  query?: (schema: SchemaDefinition<unknown>) => SchemaDefinition<Q>;
  body?: (schema: SchemaDefinition<unknown>) => SchemaDefinition<B>;
  headers?: (schema: SchemaDefinition<unknown>) => SchemaDefinition<H>;
}

export interface EndpointSchemaResponseInput<B = unknown, H = unknown> {
  body?: (schema: SchemaDefinition<unknown>) => SchemaDefinition<B>;
  headers?: (schema: SchemaDefinition<unknown>) => SchemaDefinition<H>;
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

export interface EndpointSchemaInputV2<
  RequestQuery,
  RequestBody,
  RequestHeaders,
  ResponseBody,
  ResponseHeaders
> {
  summary?: string;
  description?: string;
  request?: {
    query?: ObjectField<RequestQuery>,
    body?: ObjectField<RequestBody>,
    headers?: ObjectField<RequestHeaders>,
  }
  response?: {
    body?: ObjectField<ResponseBody>,
    headers?: ObjectField<ResponseHeaders>,
  };
}

export type EndpointSchema<T, U> = {
  summary?: string;
  description?: string;
  request: SchemaDefinition<T>;
  response: SchemaDefinition<U>;
}

export type EndpointRequest<Q, B, H> = Filter<
  Record<string, unknown>,
  {
    query: Q;
    body: B;
    headers: H;
  }
>

export type EndpointResponse<B, H> = (
  B extends Record<string, unknown> ? { body: B } : unknown
) & (
  (H extends Record<string, unknown> ? { headers: H } : unknown)
  & { headers?: { [key: string]: string } }
)

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

export function endpointSchemaFactoryV2 (baseOptions: Options) {
  return function endpointSchema<
    RequestQuery,
    RequestBody,
    RequestHeaders,
    ResponseBody,
    ResponseHeaders
  > (
    input: EndpointSchemaInputV2<
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
    return {
      summary: input.summary,
      description: input.description,
      request: defineObjectSchema({
        [options.keyNameMap.request.query]: (input.request?.query ?? field.object({}, {}))
          .allowAdditionalProperties(),
        [options.keyNameMap.request.body]: (input.request?.body ?? field.object({}, {}))
          .denyAdditionalProperties(),
        [options.keyNameMap.request.headers]: (input.request?.headers ?? field.object({}, {}))
          .allowAdditionalProperties()
      } as any),
      response: defineObjectSchema({
        [options.keyNameMap.response.body]: (input.response?.body ?? field.object({}, {}))
          .denyAdditionalProperties(),
        [options.keyNameMap.response.headers]: (input.response?.headers ?? field.object({}, {}))
          .denyAdditionalProperties()
      } as any)
    } as EndpointSchema<
      EndpointRequest<RequestQuery, RequestBody, RequestHeaders>,
      EndpointResponse<ResponseBody, ResponseHeaders>
    >
  }
}

export const endpointSchema = endpointSchemaFactory(defaultOptions)

export type ResponseBody<T> = T extends EndpointSchema<
  unknown,
  EndpointResponse<infer B, unknown>
> ? B : never

export type ResponseHeaders<T> = T extends EndpointSchema<
  unknown,
  EndpointResponse<unknown, infer H>
> ? H : never

export type RequestQuery<T> = T extends EndpointSchema<
  EndpointRequest<infer Q, unknown, unknown>,
  unknown
> ? Q : never

export type RequestBody<T> = T extends EndpointSchema<
  EndpointRequest<unknown, infer B, unknown>,
  unknown
> ? B : never

export type RequestHeaders<T> = T extends EndpointSchema<
  EndpointRequest<unknown, unknown, infer H>,
  unknown
> ? H : never
