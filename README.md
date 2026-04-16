# flow diagram AI Skill

Public repository for the `flow-diagram-ai` Codex skill.

This skill generates, updates, validates, and materializes JSON snapshots used by the FlowChartAI dashboard editor. It can work in two modes:

- `JSON-only`: return one valid snapshot payload.
- `Ready-project`: create a runnable dashboard starter with the generated snapshot already injected.

## Repository Structure

```text
.
├── assets/                      # README images
├── skills/
│   └── flow-diagram-ai/
│       ├── SKILL.md
│       ├── references/
│       ├── examples/
│       ├── scripts/
│       └── starter/dashboard-frontend/
└── README.md
```

## What The Skill Does

- Generates valid FlowChartAI dashboard snapshot JSON.
- Repairs invalid snapshots so they import correctly.
- Normalizes IDs, labels, endpoints, and analysis stats.
- Provides example snapshots for common architecture patterns.
- Materializes a frontend starter project with the snapshot preloaded.

## How To Install

Copy the skill folder into your Codex skills directory:

```bash
mkdir -p ~/.codex/skills
cp -R skills/flow-diagram-ai ~/.codex/skills/flow-diagram-ai
```

After that, Codex can use the skill by name in prompts.

## How To Use

### 1. Generate only the JSON

```text
Use flow-diagram-ai to generate a diagram snapshot for a microservices e-commerce platform.
```

### 2. Generate a ready project in a folder

```text
Use flow-diagram-ai para gerar um diagrama da infraestrutura de todo o projeto em uma pasta flow-diagram.
```

When the request includes a target folder or asks for something ready to open, the skill should:

- generate the snapshot JSON;
- copy the bundled starter project;
- inject the snapshot into the default dashboard path;
- optionally install dependencies and validate the build if requested.

### 3. Repair an existing snapshot

```text
Use flow-diagram-ai to fix this invalid snapshot and keep the same architecture.
```

## Skill Contents

Inside [skills/flow-diagram-ai](/Users/macielcr7/Desktop/dev/maciel/Flow-Chart-AI/skills/flow-diagram-ai):

- [SKILL.md](/Users/macielcr7/Desktop/dev/maciel/Flow-Chart-AI/skills/flow-diagram-ai/SKILL.md): main workflow and execution rules.
- [references/snapshot-spec.md](/Users/macielcr7/Desktop/dev/maciel/Flow-Chart-AI/skills/flow-diagram-ai/references/snapshot-spec.md): snapshot contract.
- [examples](/Users/macielcr7/Desktop/dev/maciel/Flow-Chart-AI/skills/flow-diagram-ai/examples): validated example snapshots.
- [scripts/validate_snapshot.py](/Users/macielcr7/Desktop/dev/maciel/Flow-Chart-AI/skills/flow-diagram-ai/scripts/validate_snapshot.py): JSON validator.
- [scripts/materialize_starter.py](/Users/macielcr7/Desktop/dev/maciel/Flow-Chart-AI/skills/flow-diagram-ai/scripts/materialize_starter.py): starter project materializer.
- [starter/dashboard-frontend](/Users/macielcr7/Desktop/dev/maciel/Flow-Chart-AI/skills/flow-diagram-ai/starter/dashboard-frontend): frontend-only dashboard starter.

## Validation

Run the bundled smoke test:

```bash
python3 skills/flow-diagram-ai/scripts/smoke_test.py
```

Validate one specific snapshot:

```bash
python3 skills/flow-diagram-ai/scripts/validate_snapshot.py path/to/file.json
```

## Example Screens

### Dashboard Example 1

![Example 1](./assets/example1.png)

### Dashboard Example 2

![Example 2](./assets/example2.png)

### Dashboard Example 3

![Example 3](./assets/example3.png)
