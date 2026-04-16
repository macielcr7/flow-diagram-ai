# FlowChartAI Dashboard Starter

Starter oficial do frontend do editor orientado a snapshot JSON.

## O que vem pronto

- dashboard abrindo direto na rota principal;
- Snapshot Manager local com criar, trocar, renomear, duplicar e excluir snapshots;
- importacao e exportacao de snapshot JSON;
- biblioteca de exemplos para carregar no canvas;
- validacao de schema no frontend;
- edicao visual de nodes e links;
- snapshot mock base para iniciar rapido.

## Como iniciar

```bash
npm install
npm run dev
```

## Validacao

```bash
npm run typecheck
npm run lint
npm run build
```

## Arquivos principais

- `src/components/mockups/arch-dashboard/Dashboard.tsx`
- `src/components/mockups/arch-dashboard/use-dashboard-snapshot.ts`
- `src/components/mockups/arch-dashboard/infrastructure/mock/dashboard-snapshot.json`
- `src/components/mockups/arch-dashboard/infrastructure/examples`

## Fluxo principal

1. Abrir o dashboard.
2. Criar, duplicar, renomear ou carregar um snapshot.
3. Usar `Edit JSON` quando quiser importar ou exportar JSON bruto.
4. Editar nodes e links no canvas.
5. Exportar o JSON final.

## Observacao

Esse starter e frontend-only e sobe direto no dashboard, sem servidor de preview paralelo, e concentra importacao/exportacao dentro do modal `Edit JSON`.
