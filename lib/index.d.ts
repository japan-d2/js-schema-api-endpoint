import { SchemaDefinition } from '@japan-d2/schema/lib/interfaces';
export interface EndpointSchemaRequestInput<Q = unknown, B = unknown, H = unknown> {
    query?: (schema: SchemaDefinition<{}>) => SchemaDefinition<Q>;
    body?: (schema: SchemaDefinition<{}>) => SchemaDefinition<B>;
    headers?: (schema: SchemaDefinition<{}>) => SchemaDefinition<H>;
}
export interface EndpointSchemaResponseInput<B = unknown, H = unknown> {
    body?: (schema: SchemaDefinition<{}>) => SchemaDefinition<B>;
    headers?: (schema: SchemaDefinition<{}>) => SchemaDefinition<H>;
}
declare type Filter<F, T> = Pick<T, {
    [K in keyof T]: T[K] extends F ? K : never;
}[keyof T]>;
export interface EndpointSchemaInput<RequestQuery, RequestBody, RequestHeaders, ResponseBody, ResponseHeaders> {
    summary?: string;
    description?: string;
    request?: EndpointSchemaRequestInput<RequestQuery, RequestBody, RequestHeaders>;
    response?: EndpointSchemaResponseInput<ResponseBody, ResponseHeaders>;
}
export interface EndpointSchema<T, U> {
    summary?: string;
    description?: string;
    request: SchemaDefinition<T>;
    response: SchemaDefinition<U>;
}
export declare type EndpointRequest<Q, B, H> = Filter<object, {
    query: Q;
    body: B;
    headers: H;
}>;
export declare type EndpointResponse<B, H> = {
    body: B;
    headers: H;
};
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
export declare const defaultKeyNameMap: KeyNameMap;
export interface Options {
    keyNameMap: KeyNameMap;
}
export declare const defaultOptions: Options;
export declare function endpointSchemaFactory(baseOptions: Options): <RequestQuery, RequestBody, RequestHeaders, ResponseBody, ResponseHeaders>(input: EndpointSchemaInput<RequestQuery, RequestBody, RequestHeaders, ResponseBody, ResponseHeaders>, options?: Options) => EndpointSchema<Pick<{
    query: RequestQuery;
    body: RequestBody;
    headers: RequestHeaders;
}, (RequestQuery extends object ? "query" : never) | (RequestBody extends object ? "body" : never) | (RequestHeaders extends object ? "headers" : never)>, EndpointResponse<ResponseBody, ResponseHeaders>>;
export declare const endpointSchema: <RequestQuery, RequestBody, RequestHeaders, ResponseBody, ResponseHeaders>(input: EndpointSchemaInput<RequestQuery, RequestBody, RequestHeaders, ResponseBody, ResponseHeaders>, options?: Options) => EndpointSchema<Pick<{
    query: RequestQuery;
    body: RequestBody;
    headers: RequestHeaders;
}, (RequestQuery extends object ? "query" : never) | (RequestBody extends object ? "body" : never) | (RequestHeaders extends object ? "headers" : never)>, EndpointResponse<ResponseBody, ResponseHeaders>>;
export {};
