import { defineSchema } from '@japan-d2/schema'
import { SchemaDefinition } from '@japan-d2/schema/lib/interfaces'

export interface EndpointSchemaRequestInput <Q = unknown, B = unknown, H = unknown> {
  query?: (schema: SchemaDefinition<{}>) => SchemaDefinition<Q>;
  body?: (schema: SchemaDefinition<{}>) => SchemaDefinition<B>;
  headers?: (schema: SchemaDefinition<{}>) => SchemaDefinition<H>;
}

export interface EndpointSchemaResponseInput <B = unknown, H = unknown> {
  body?: (schema: SchemaDefinition<{}>) => SchemaDefinition<B>;
  headers?: (schema: SchemaDefinition<{}>) => SchemaDefinition<H>;
}

type Filter<F, T> = Pick<T, ({
  [K in keyof T]: T[K] extends F ? K : never
})[keyof T]>;

export interface EndpointSchemaInput <
  RequestQuery, RequestBody, RequestHeaders,
  ResponseBody, ResponseHeaders,
> {
  summary?: string;
  description?: string;
  request?: EndpointSchemaRequestInput<RequestQuery, RequestBody, RequestHeaders>;
  response?: EndpointSchemaResponseInput<ResponseBody, ResponseHeaders>;
}

export interface EndpointSchema <T, U> {
  summary?: string;
  description?: string;
  request: SchemaDefinition<T>;
  response: SchemaDefinition<U>;
}

export type EndpointRequest <Q, B, H> = Filter<object, {
  query: Q;
  body: B;
  headers: H;
}>

export type EndpointResponse <B, H> = {
  body: B;
  headers?: H;
}

interface KeyNameMap {
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

const defaultKeyNameMap: KeyNameMap = {
  request: {
    query: 'queryStringParameters',
    body: 'body',
    headers: 'headers'
  },
  response: {
    body: 'body',
    headers: 'headers'
  }
}

export function endpointSchema <
  RequestQuery, RequestBody, RequestHeaders,
  ResponseBody, ResponseHeaders,
>
(
  input: EndpointSchemaInput<RequestQuery, RequestBody, RequestHeaders, ResponseBody, ResponseHeaders>,
  keyNameMap = defaultKeyNameMap
):
EndpointSchema<
  EndpointRequest<RequestQuery, RequestBody, RequestHeaders>,
  EndpointResponse<ResponseBody, ResponseHeaders>
> {
  let request = defineSchema()

  if (input.request) {
    const { query, body, headers } = input.request

    if (query) {
      request = request.object(keyNameMap.request.query, query(defineSchema()), {
        additionalProperties: true
      })
    }

    if (body) {
      request = request.object(keyNameMap.request.body, body(defineSchema()), {
        additionalProperties: false
      })
    }

    if (headers) {
      request = request.object(keyNameMap.request.headers, headers(defineSchema()), {
        additionalProperties: true
      })
    }
  }

  let response = defineSchema()

  if (input.response) {
    const { body, headers } = input.response

    if (body) {
      response = response.object(keyNameMap.response.body, body(defineSchema()), {
        additionalProperties: false
      })
    }

    if (headers) {
      response = response.object(keyNameMap.response.headers, headers(defineSchema()), {
        additionalProperties: false
      })
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
