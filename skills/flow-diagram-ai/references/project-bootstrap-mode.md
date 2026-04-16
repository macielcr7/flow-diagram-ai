# Project Bootstrap Mode

Use this mode when the user asks for a local folder, a ready starter, or something they can open and run.

## Trigger phrases

- "em uma pasta ..."
- "crie um projeto ..."
- "pronto para abrir"
- "pronto para rodar"
- "funcional"
- "starter"
- "dashboard local"

## Expected result

Do not stop at raw JSON. The delivery should include:

1. a validated snapshot JSON;
2. a copied starter project;
3. the generated snapshot already written into:
   - `src/components/mockups/arch-dashboard/infrastructure/mock/dashboard-snapshot.json`
4. a root copy of the same JSON at:
   - `diagram.snapshot.json`

## Recommended execution

1. Generate the snapshot JSON.
2. Validate it with `scripts/validate_snapshot.py`.
3. Materialize the starter:

```bash
python3 scripts/materialize_starter.py \
  --target /desired/folder \
  --snapshot-file /path/to/generated.json
```

4. If the user asked for a runnable initialized project, add:

```bash
python3 scripts/materialize_starter.py \
  --target /desired/folder \
  --snapshot-file /path/to/generated.json \
  --install \
  --validate
```

## What to report back

- path of the generated folder;
- path of the injected snapshot;
- whether `npm install` and validation were executed.
