# Import Checklist

Use esta checklist antes de considerar um snapshot pronto para importar no editor.

## Estrutura

- O JSON e um objeto unico.
- `version` e `1`.
- `meta`, `diagrams`, `layout`, `endpointsByNode` e `analysis` existem.

## Nodes e conexoes

- Todo `node.id` e unico.
- Todo `connection.id` e unico.
- `connection.from` e `connection.to` apontam para nodes existentes.
- Todo node possui `label`, `sublabel`, `type`, `tech`, `x`, `y`, `w`, `h`, `ops`.

## Endpoints

- Todo node possui entrada em `endpointsByNode`.
- Nodes sem endpoint usam `[]`.
- Todos os metodos HTTP sao suportados pelo contrato.

## Analise

- `analysis.source` esta correto.
- `analysis.stats.services` bate com `layout.nodes.length`.
- `analysis.stats.flows` bate com `layout.connections.length`.
- `analysis.stats.endpoints` bate com a soma real dos endpoints.

## Layout

- O diagrama nao possui overlap gritante.
- Entrypoints ficam mais a esquerda.
- Services e workers ficam no meio.
- Bancos, caches e providers ficam mais a direita.

## Validacao final

Execute:

```bash
python3 scripts/validate_snapshot.py /path/to/file.json
```

So importe no dashboard se o validador retornar `Snapshot valid`.
