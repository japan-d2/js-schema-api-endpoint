"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@japan-d2/schema");
exports.defaultKeyNameMap = {
    request: {
        query: 'query',
        body: 'body',
        headers: 'headers'
    },
    response: {
        body: 'body',
        headers: 'headers'
    }
};
exports.defaultOptions = {
    keyNameMap: exports.defaultKeyNameMap
};
function endpointSchemaFactory(baseOptions) {
    return function endpointSchema(input, options = baseOptions) {
        let request = schema_1.defineSchema();
        if (input.request) {
            const { query, body, headers } = input.request;
            if (query) {
                request = request.object(options.keyNameMap.request.query, query(schema_1.defineSchema()), {
                    additionalProperties: true
                });
            }
            if (body) {
                request = request.object(options.keyNameMap.request.body, body(schema_1.defineSchema()), {
                    additionalProperties: false
                });
            }
            if (headers) {
                request = request.object(options.keyNameMap.request.headers, headers(schema_1.defineSchema()), {
                    additionalProperties: true
                });
            }
        }
        let response = schema_1.defineSchema();
        if (input.response) {
            const { body, headers } = input.response;
            if (body) {
                response = response.object(options.keyNameMap.response.body, body(schema_1.defineSchema()), {
                    additionalProperties: false
                });
            }
            if (headers) {
                response = response.object(options.keyNameMap.response.headers, headers(schema_1.defineSchema()), {
                    additionalProperties: false
                });
            }
        }
        return {
            summary: input.summary,
            description: input.description,
            request,
            response
        };
    };
}
exports.endpointSchemaFactory = endpointSchemaFactory;
exports.endpointSchema = endpointSchemaFactory(exports.defaultOptions);
