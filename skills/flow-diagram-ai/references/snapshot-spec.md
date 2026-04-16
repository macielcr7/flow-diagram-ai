# Snapshot Spec

Use this reference when generating or repairing FlowChartAI dashboard snapshot JSON.

## Root shape

```json
{
  "version": 1,
  "meta": {
    "id": "string",
    "name": "string",
    "description": "string",
    "systemSlug": "string",
    "status": "draft | analyzed",
    "createdAt": "ISO-8601 datetime",
    "updatedAt": "ISO-8601 datetime"
  },
  "diagrams": [
    {
      "id": "string",
      "name": "string",
      "desc": "string",
      "dot": true
    }
  ],
  "layout": {
    "nodes": [],
    "connections": []
  },
  "endpointsByNode": {},
  "analysis": {
    "source": "mock | ai",
    "lastAnalyzedAt": "ISO-8601 datetime | null",
    "stats": {
      "services": 0,
      "endpoints": 0,
      "flows": 0
    }
  }
}
```

## Allowed enums

### Node types

- `SERVICE`
- `DATABASE`
- `QUEUE`
- `EXTERNAL`
- `WORKER`
- `CACHE`
- `GATEWAY`
- `LOAD_BALANCER`
- `AUTH_PROVIDER`
- `OBJECT_STORAGE`
- `CDN`
- `OBSERVABILITY`
- `FEATURE_FLAGS`
- `SEARCH_ENGINE`
- `EMAIL_GATEWAY`

### HTTP methods

- `GET`
- `POST`
- `PUT`
- `DELETE`
- `PATCH`

### Meta status

- `draft`
- `analyzed`

### Analysis source

- `mock`
- `ai`

## Node shape

```json
{
  "id": "string",
  "label": "string",
  "sublabel": "string",
  "type": "SERVICE",
  "tech": "string",
  "x": 40,
  "y": 80,
  "w": 168,
  "h": 92,
  "ops": ["READ", "WRITE"]
}
```

Rules:
- `id` must be unique inside `layout.nodes`.
- `w` and `h` must be positive.
- `x` and `y` are free-form numeric coordinates.
- Use short, human-readable IDs such as `api-gateway`, `orders-svc`, `billing-db`.
- Keep `label` user-facing.
- Keep `tech` short: `React`, `NestJS`, `PostgreSQL`, `Redis`, `Kafka`, `Stripe`.
- Keep `ops` short and uppercase when possible.

## Connection shape

```json
{
  "id": "string",
  "from": "source-node-id",
  "to": "target-node-id",
  "label": "HTTP",
  "dashed": false,
  "routing": {
    "axis": "x | y",
    "value": 420
  }
}
```

Rules:
- `id` must be unique inside `layout.connections`.
- `from` and `to` must point to existing node IDs.
- Keep `label` short.
- Use `dashed: true` for asynchronous or event-driven flows.
- Use `dashed: false` for direct synchronous flows.
- `routing` is optional.
- Omit `routing` for the default automatic orthogonal route.
- When present, `routing.axis` must be `x` or `y`.
- `routing.value` stores the dragged central segment position used by the editor.
- Preserve existing `routing` values when updating a snapshot unless the user explicitly wants to reset the route.

## Endpoint map shape

```json
{
  "orders-svc": [
    { "method": "GET", "path": "/orders" },
    { "method": "POST", "path": "/orders" }
  ],
  "orders-db": []
}
```

Rules:
- Include an entry for every node.
- Use `[]` when the node has no endpoints to display.
- Keep `path` non-empty.
- For databases, caches, queues, and external providers, pseudo-endpoints are acceptable when they help the UI show interactions, but keep them simple.

## Diagram rules

- Prefer a single primary diagram entry for the current product flow.
- Recommended default:

```json
[
  {
    "id": "same-as-meta-id",
    "name": "same-as-meta-name",
    "desc": "Primary architecture snapshot",
    "dot": true
  }
]
```

## Layout heuristics

- Start around `x = 40`, `y = 80`.
- Use horizontal gaps around `220` to `260`.
- Use vertical gaps around `110` to `130`.
- Typical sizes:
  - `SERVICE`, `WORKER`, `QUEUE`, `GATEWAY`, `EXTERNAL`, `LOAD_BALANCER`, `AUTH_PROVIDER`, `CDN`, `OBSERVABILITY`, `FEATURE_FLAGS`, `SEARCH_ENGINE`, `EMAIL_GATEWAY`: `162-172 x 92`
  - `DATABASE`, `CACHE`, `OBJECT_STORAGE`: `180-185 x 92`
- Avoid overlap.
- Keep related nodes aligned in lanes when possible.

## Stats formulas

- `analysis.stats.services` = `layout.nodes.length`
- `analysis.stats.flows` = `layout.connections.length`
- `analysis.stats.endpoints` = total number of endpoint objects across every `endpointsByNode[nodeId]`

Never handwave these values.

## Timestamps

Use ISO-8601 datetimes, for example:

- `2026-04-15T19:00:00.000Z`

## Recommended defaults for fresh AI output

- `analysis.source`: `"ai"`
- `meta.status`: `"analyzed"`
- `diagrams.length`: `1`
- `analysis.lastAnalyzedAt`: same timestamp as `updatedAt`

## Manual validation checklist

- Root contains every required top-level key.
- Every node ID is unique.
- Every connection ID is unique.
- Every connection points to valid nodes.
- Every node has an endpoint map entry.
- Every enum value is valid.
- Stats exactly match the content counts.
- JSON parses without comments or trailing commas.

## Common mistakes

- Missing `endpointsByNode` entries for nodes without endpoints.
- Connection pointing to a renamed node ID.
- `analysis.stats` not matching the real counts.
- Using unsupported methods such as `OPTIONS`.
- Returning Markdown fences instead of raw JSON.
