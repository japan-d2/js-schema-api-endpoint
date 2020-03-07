/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { endpointSchema } from '../src/index'

it('definition', () => {
  const schema = endpointSchema({
    summary: 'test',
    description: 'this is test endpoint',
    request: {
      query: d => d.string('q'),
      body: d => d.string('b'),
      headers: d => d.string('h')
    },
    response: {
      body: d => d.string('b'),
      headers: d => d.string('h')
    }
  })

  expect(schema.summary).toBe('test')
  expect(schema.description).toBe('this is test endpoint')
  expect(schema.request.toJSONSchema()).toStrictEqual({
    type: 'object',
    properties: {
      queryStringParameters: {
        type: 'object',
        properties: { q: { type: 'string' } },
        required: ['q'],
        additionalProperties: true
      },
      body: {
        type: 'object',
        properties: { b: { type: 'string' } },
        required: ['b'],
        additionalProperties: false
      },
      headers: {
        type: 'object',
        properties: { h: { type: 'string' } },
        required: ['h'],
        additionalProperties: true
      }
    },
    required: ['queryStringParameters', 'body', 'headers']
  })
  expect(schema.response.toJSONSchema()).toStrictEqual({
    type: 'object',
    properties: {
      body: {
        type: 'object',
        properties: { b: { type: 'string' } },
        required: ['b'],
        additionalProperties: false
      },
      headers: {
        type: 'object',
        properties: { h: { type: 'string' } },
        required: ['h'],
        additionalProperties: false
      }
    },
    required: ['body', 'headers']
  })
})

it('definition with custom key map', () => {
  const schema = endpointSchema({
    request: {
      query: d => d.string('q'),
      body: d => d.string('b'),
      headers: d => d.string('h')
    },
    response: {
      body: d => d.string('b'),
      headers: d => d.string('h')
    }
  }, {
    request: {
      query: 'q',
      body: 'b',
      headers: 'h'
    },
    response: {
      body: 'b',
      headers: 'h'
    }
  })

  expect(schema.request.toJSONSchema()).toStrictEqual({
    type: 'object',
    properties: {
      q: {
        type: 'object',
        properties: { q: { type: 'string' } },
        required: ['q'],
        additionalProperties: true
      },
      b: {
        type: 'object',
        properties: { b: { type: 'string' } },
        required: ['b'],
        additionalProperties: false
      },
      h: {
        type: 'object',
        properties: { h: { type: 'string' } },
        required: ['h'],
        additionalProperties: true
      }
    },
    required: ['q', 'b', 'h']
  })
  expect(schema.response.toJSONSchema()).toStrictEqual({
    type: 'object',
    properties: {
      b: {
        type: 'object',
        properties: { b: { type: 'string' } },
        required: ['b'],
        additionalProperties: false
      },
      h: {
        type: 'object',
        properties: { h: { type: 'string' } },
        required: ['h'],
        additionalProperties: false
      }
    },
    required: ['b', 'h']
  })
})
