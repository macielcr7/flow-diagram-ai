# Text To JSON Examples

Use these input patterns as references when converting architecture prose into one snapshot.

When the user asks for a folder or starter project instead of only JSON, pair one of these patterns with [project-bootstrap-mode.md](project-bootstrap-mode.md).

## Example 1

### Input text

```text
We have a React admin panel behind a CDN. Requests go through an API gateway to a catalog service.
Catalog updates publish events to Kafka. A worker consumes those events, indexes products in OpenSearch,
stores analytics in PostgreSQL, and sends digest emails through Resend. Datadog receives logs and traces.
```

### Suggested example snapshot

- [observability-search-email.snapshot.json](../examples/observability-search-email.snapshot.json)

## Example 2

### Input text

```text
Our CRM is still a monolith. Users access a web app, which talks to one Laravel application.
The app stores data in PostgreSQL, caches data in Redis, sends transactional emails through SES,
reads feature flags from Unleash, and pushes metrics to Grafana.
```

### Suggested example snapshot

- [monolith-crm.snapshot.json](../examples/monolith-crm.snapshot.json)

## Example 3

### Input text

```text
We upload videos through a frontend and API. Upload jobs go into RabbitMQ.
A Go worker transcodes media, writes files to S3, indexes metadata in OpenSearch,
sends completion email notifications, and exports telemetry to Datadog.
```

### Suggested example snapshot

- [queue-worker-media.snapshot.json](../examples/queue-worker-media.snapshot.json)
