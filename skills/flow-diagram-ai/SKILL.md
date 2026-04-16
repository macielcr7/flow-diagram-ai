---
name: flow-diagram-ai
description: Generate, update, normalize, and validate FlowChartAI dashboard snapshot JSON used by the architecture mock dashboard. Use when Codex needs to turn architecture notes, repository analysis, system descriptions, or existing partial JSON into one importable snapshot payload for the diagram editor without breaking the expected schema.
---

# Flow Diagram JSON

Generate one valid dashboard snapshot JSON for the FlowChartAI mock dashboard, or materialize a ready local dashboard project from the bundled starter.

## Execution modes

Choose the mode from the user's request before doing any work.

### 1. JSON-only mode

Use this when the user asks only for a snapshot, schema repair, normalization, or raw JSON output.

Expected result:
- one valid JSON object;
- optional validation report if requested.

### 2. Ready-project mode

Use this when the user asks for:
- a folder or path such as `flow-diagram`, `diagram/`, or `output/...`;
- a ready project, starter, app, or dashboard to open locally;
- something "funcional", "pronto para abrir", "pronto para rodar", or similar.

Expected result:
- generate the snapshot JSON;
- create the target folder from [starter/dashboard-frontend](starter/dashboard-frontend);
- write the generated snapshot into the starter's canonical path;
- keep a copy of the generated JSON at the project root for easy inspection;
- if the user explicitly asks to leave it fully initialized, run `npm install` in the generated folder and validate the build.

## Workflow

1. Extract the architecture from the user input:
- nodes/components
- directed connections between nodes
- endpoints owned by each node
- top-level metadata for the diagram

2. Read [references/snapshot-spec.md](references/snapshot-spec.md) for the exact schema, allowed enums, layout rules, ID conventions, and validation checklist.

3. Before finalizing, review [references/import-checklist.md](references/import-checklist.md) to catch common import failures.

4. When the input is architecture prose, use [references/text-to-json-guide.md](references/text-to-json-guide.md) to reduce it into nodes, flows, endpoints, and metadata.

5. When creating a new file from scratch, start from [assets/dashboard-snapshot.template.json](assets/dashboard-snapshot.template.json).

6. When you need a ready-made instruction block for another model, use [references/prompt-pattern.md](references/prompt-pattern.md) and [references/scenario-prompt-recipes.md](references/scenario-prompt-recipes.md).

7. When the user needs a concrete example, reuse one of the bundled snapshots in [examples](examples/README.md).

8. When the user asks for a ready project or starter, use [scripts/materialize_starter.py](scripts/materialize_starter.py) with [starter/dashboard-frontend](starter/dashboard-frontend) instead of stopping at raw JSON.

9. When the user needs prose conversion help, use [references/text-to-json-examples.md](references/text-to-json-examples.md) together with the other guides.

10. In JSON-only mode, produce exactly one JSON object unless the user explicitly asks for explanation around it.

11. In ready-project mode:
```bash
python3 scripts/materialize_starter.py \
  --target /absolute/or/relative/output-folder \
  --snapshot-file /path/to/generated-snapshot.json
```

Optional full initialization:
```bash
python3 scripts/materialize_starter.py \
  --target /absolute/or/relative/output-folder \
  --snapshot-file /path/to/generated-snapshot.json \
  --install \
  --validate
```

12. Before finishing, validate with:
```bash
python3 scripts/validate_snapshot.py /path/to/file.json
```

13. For full package integrity, run:
```bash
python3 scripts/smoke_test.py
```

## Required output rules

- In JSON-only mode, return raw JSON only unless the user asks for commentary.
- In ready-project mode, do not stop after generating JSON; create the target project folder and report the resulting path.
- Keep `version` equal to `1`.
- Use only allowed node types and HTTP methods from the spec.
- Keep node IDs unique.
- Keep connection IDs unique.
- Ensure every connection `from` and `to` points to an existing node ID.
- Include an `endpointsByNode` entry for every node. Use `[]` when the node has no endpoints.
- Recalculate `analysis.stats` from the final JSON instead of guessing.
- If the snapshot is AI-generated, default `analysis.source` to `"ai"`.
- For a finished AI-generated import, default `meta.status` to `"analyzed"` and set `analysis.lastAnalyzedAt`.
- For an intentionally incomplete draft, use `meta.status` = `"draft"` and `analysis.lastAnalyzedAt` = `null`.

## Layout rules

- Build the canvas left-to-right.
- Put entrypoints and clients on the left.
- Put services, queues, and workers in the middle.
- Put databases, caches, and external providers on the right.
- Keep enough spacing to avoid overlap.
- Prefer short connection labels such as `HTTP`, `REST`, `gRPC`, `publish`, `consume`, `read`, `write`, `cache`, `sync`, `async`.

## Normalization rules

- Set `sublabel` to the same semantic family as `type`. In most cases, keep it equal to `type`.
- Keep `ops` short and uppercase when they represent actions shown inside the card.
- If the source material is ambiguous, simplify the diagram to the most important architectural components instead of inventing low-value nodes.
- Preserve existing IDs when updating an existing snapshot unless the user explicitly wants a redesign.

## Common tasks

- Create a new snapshot JSON from architecture text.
- Repair an invalid snapshot JSON so it imports correctly.
- Expand a minimal snapshot with endpoints, connections, and stats.
- Normalize naming, IDs, labels, and layout while keeping the same architecture.
- Bootstrap a ready-to-run dashboard starter from `starter/dashboard-frontend`.
- Materialize a folder such as `flow-diagram/` with starter code plus the generated snapshot already loaded as the default dashboard state.
