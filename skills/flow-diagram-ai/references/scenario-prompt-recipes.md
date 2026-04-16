# Scenario Prompt Recipes

Use these prompt blocks when another model needs to generate a snapshot for a specific architecture shape.

## Monolith CRM

```text
Generate one FlowChartAI dashboard snapshot JSON for a monolithic CRM.

Constraints:
- Single main application service.
- Include Redis cache.
- Include Email Gateway.
- Include Feature Flags.
- Include Observability.
- Keep data persistence in one PostgreSQL database.
- Prefer 7 to 9 nodes.
- Use analysis.source = "ai".
```

## Queue + Worker Media Pipeline

```text
Generate one FlowChartAI dashboard snapshot JSON for a media processing pipeline.

Constraints:
- Include one client app.
- Include one API gateway or upload service.
- Include one queue.
- Include one worker.
- Include Object Storage.
- Include Search Engine.
- Include Email Gateway.
- Include Observability.
- Show async connections as dashed.
```

## Gateway + Auth + Edge

```text
Generate one FlowChartAI dashboard snapshot JSON for an edge delivery architecture.

Constraints:
- Include CDN.
- Include Load Balancer.
- Include API Gateway.
- Include Auth Provider.
- Include one user-facing web app.
- Include one core service.
- Include Cache.
- Include one PostgreSQL database.
- Include Observability.
```

## Search + Observability + Email

```text
Generate one FlowChartAI dashboard snapshot JSON for an operational analytics flow.

Constraints:
- Include Search Engine.
- Include Email Gateway.
- Include Observability.
- Include Feature Flags.
- Include one service and one worker.
- Include one queue.
- Include one database.
- Keep the layout left-to-right with infra on the right.
```
