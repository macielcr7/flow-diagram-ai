# Text To JSON Guide

Use this guide when the user describes a system in prose and you need to turn it into one importable snapshot.

## Extraction order

1. Identify entrypoints.
   Examples: web app, mobile app, CDN, load balancer, gateway.

2. Identify core execution nodes.
   Examples: services, workers, queues.

3. Identify persistence and providers.
   Examples: databases, caches, object storage, externals, auth, search, email.

4. Identify directed flows.
   Use short labels such as `HTTP`, `REST`, `publish`, `consume`, `cache`, `index`, `notify`.

5. Identify endpoints.
   Each node must have an entry in `endpointsByNode`, even when it is `[]`.

## Reduction rule

If the description is large or messy:
- keep only the most important architectural elements;
- avoid inventing low-value nodes;
- prefer one clear snapshot over an exhaustive but unreadable one.

## Naming rule

- `meta.name` should be user-facing.
- `meta.id` and `systemSlug` should be short and slug-like.
- `label` should be readable in the card.
- `sublabel` should usually match `type`.

## Output rule

- Return raw JSON only unless the user explicitly asks for commentary.
- Validate before finishing.
