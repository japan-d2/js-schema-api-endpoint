# schema-api-endpoint

API endpoint specification based on @japan-d2/schema

# install

```bash
npm install @japan-d2/schema-api-endpoint
```

or

```bash
yarn add @japan-d2/schema-api-endpoint
```

# usage

```
const schema = endpointSchema({
  summary: 'test endpoint',
  description: 'this is test endpoint',
  request: {
    query: d => d.string('name'),
    body: d => d.string('data'),
    headers: d => d.string('authorization')
  },
  response: {
    body: d => d.string('data'),
    headers: d => d.string('cache-control')
  }
})

schema.request.toJSONSchema()
schema.response.toJSONSchema()
```

# license

MIT
