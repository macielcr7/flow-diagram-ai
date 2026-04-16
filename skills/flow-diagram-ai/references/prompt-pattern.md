# Prompt Pattern

Use this pattern when you want another model to generate a FlowChartAI snapshot JSON directly.

## Ready prompt

```text
Generate one valid FlowChartAI dashboard snapshot JSON for import into the architecture mock dashboard.

Output rules:
- Return raw JSON only.
- Do not use Markdown fences.
- Use schema version 1.
- Keep exactly one primary diagram entry.
- Use only these node types: SERVICE, DATABASE, QUEUE, EXTERNAL, WORKER, CACHE, GATEWAY, LOAD_BALANCER, AUTH_PROVIDER, OBJECT_STORAGE, CDN, OBSERVABILITY, FEATURE_FLAGS, SEARCH_ENGINE, EMAIL_GATEWAY.
- Use only these HTTP methods: GET, POST, PUT, DELETE, PATCH.
- Every node must have an endpointsByNode entry, even if it is [].
- Every connection must reference existing node IDs.
- Recalculate analysis.stats from the final JSON.
- Use analysis.source = "ai".
- Default meta.status = "analyzed".
- Use ISO-8601 timestamps.

Layout rules:
- Left to right architecture.
- Clients and gateways on the left.
- Services, queues, and workers in the middle.
- Databases, caches, and externals on the right.
- Avoid overlapping nodes.

Input architecture:
[PASTE THE SYSTEM DESCRIPTION HERE]
```

## Update prompt

```text
Update the existing FlowChartAI dashboard snapshot JSON below without changing the schema shape.

Rules:
- Return raw JSON only.
- Preserve stable IDs when possible.
- Keep unsupported fields out.
- Recalculate analysis.stats.
- Keep every connection valid after renames.
- Keep endpointsByNode aligned with the final node IDs.

Existing JSON:
[PASTE CURRENT JSON HERE]

Requested changes:
[PASTE CHANGES HERE]
```

## Project bootstrap prompt

```text
Analyze the project and generate one valid FlowChartAI dashboard snapshot JSON for the full infrastructure.

After generating the JSON:
- create a local dashboard project in the folder [PASTE TARGET FOLDER];
- use the FlowChartAI dashboard starter as the base project;
- write the generated snapshot into the starter path:
  src/components/mockups/arch-dashboard/infrastructure/mock/dashboard-snapshot.json
- also save a copy at the project root as diagram.snapshot.json
- if asked to leave it runnable, install dependencies and validate the build.

Output rules:
- do not stop at raw JSON only;
- the main deliverable is the folder with the working starter plus the injected snapshot.
```
