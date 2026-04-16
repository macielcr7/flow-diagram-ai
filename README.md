# flow diagram AI Skill

Repositório público da skill `flow-diagram-ai` para Codex.

Essa skill foi criada para transformar descrição de arquitetura, análise de projeto ou JSON parcial em um snapshot válido para o dashboard do FlowChartAI. O resultado pode ser:

- apenas o JSON final do diagrama;
- ou um projeto frontend já materializado com o dashboard pronto para abrir e editar.

## O que a skill resolve

O problema principal aqui não é só desenhar caixas e setas. O objetivo é produzir um contrato consistente entre:

- componentes da arquitetura;
- conexões entre esses componentes;
- endpoints expostos por cada elemento;
- metadados e estatísticas de análise;
- layout visual importável no editor.

A skill centraliza esse fluxo e evita que cada geração de diagrama invente um formato diferente.

## Como o dashboard funciona

O dashboard é um editor visual orientado a snapshot JSON. Ele não depende de backend para o fluxo principal e funciona como uma área de trabalho para montar, revisar e exportar diagramas de arquitetura.

### Estrutura da interface

O dashboard é dividido em quatro áreas principais:

1. `Top bar`
   Mostra o status do snapshot, totais de serviços, endpoints e fluxos, além das ações principais:
   - `Snapshots`
   - `Load Example`
   - `Edit JSON`
   - `Analyze Snapshot`

2. `Left sidebar`
   Funciona como paleta de componentes. Os tipos podem ser arrastados para o canvas:
   - `Service`
   - `Database`
   - `Queue`
   - `External`
   - `Worker`
   - `Cache`
   - `Gateway`
   - `Load Balancer`
   - `Auth Provider`
   - `Object Storage`
   - `CDN`
   - `Observability`
   - `Feature Flags`
   - `Search Engine`
   - `Email Gateway`

3. `Canvas central`
   É o diagrama em si. Nele você pode:
   - mover componentes;
   - arrastar novos componentes para o canvas;
   - criar conexões arrastando a seta do card;
   - selecionar conexões com um clique;
   - editar um componente com duplo clique;
   - editar uma conexão clicando na linha;
   - reposicionar manualmente a rota da conexão pelo handle central;
   - navegar com zoom, pan e mini-map.

4. `Inspector`
   Painel contextual à direita. Ele muda de acordo com a seleção atual:
   - quando um componente está selecionado, mostra endpoints, fluxos relacionados e ações do nó;
   - quando nenhuma seleção está ativa, funciona como visão geral de endpoints e configurações;
   - quando uma conexão está selecionada, abre sua edição;
   - também concentra configurações de modo e animação.

## Como o diagrama funciona

O diagrama é persistido em um snapshot JSON com um contrato fixo. Em termos práticos, ele é composto por estes blocos:

- `meta`
  Identidade do snapshot, nome, descrição, timestamps e status.

- `diagrams`
  Lista dos diagramas disponíveis. O fluxo atual trabalha, na prática, com um diagrama principal.

- `layout.nodes`
  Componentes visuais do canvas.

- `layout.connections`
  Ligações direcionais entre componentes.

- `endpointsByNode`
  Endpoints associados a cada componente.

- `analysis`
  Fonte da análise, timestamp da última execução e estatísticas agregadas.

### Modelo mental do editor

O dashboard trata o diagrama como uma combinação de:

- semântica de arquitetura;
- estrutura visual;
- inspeção operacional.

Cada card não é apenas um bloco visual. Ele representa um elemento do sistema com:

- tipo;
- tecnologia;
- operações resumidas;
- endpoints associados;
- relações de entrada e saída.

Cada conexão também não é apenas uma linha. Ela representa um fluxo direcionado entre componentes, com:

- origem e destino;
- rótulo curto;
- comportamento síncrono ou assíncrono;
- rota automática ou manual.

### Comportamento visual das conexões

Quando um componente é selecionado:

- fluxos `incoming` recebem destaque em uma cor;
- fluxos `outgoing` recebem destaque em outra cor;
- cards relacionados permanecem em evidência;
- elementos sem vínculo ficam com opacidade reduzida.

Isso permite ler o contexto do componente sem perder a visão do sistema inteiro.

### Rota manual das linhas

As conexões usam rota ortogonal por padrão. Quando necessário, a linha pode ser ajustada manualmente:

- selecione a conexão;
- clique e segure o handle central;
- arraste para reposicionar o segmento principal;
- o valor passa a ser salvo em `routing`;
- `Reset route` retorna a conexão ao modo automático.

Esse detalhe é importante porque o editor não gera apenas um JSON válido; ele também preserva decisões de legibilidade do layout.

## Modos de uso da skill

### 1. JSON-only

Use quando você quer apenas o snapshot final.

Exemplo:

```text
Use flow-diagram-ai to generate a diagram snapshot for a microservices e-commerce platform.
```

### 2. Ready-project

Use quando você quer um projeto pronto para abrir localmente.

Exemplo:

```text
Use flow-diagram-ai para gerar um diagrama da infraestrutura de todo o projeto em uma pasta flow-diagram.
```

Nesse modo, a skill deve:

- gerar o snapshot JSON;
- copiar o starter do dashboard;
- gravar o snapshot no caminho padrão consumido pela interface;
- opcionalmente instalar dependências e validar o build.

### 3. Repair / Normalize

Use quando já existe um JSON e você quer corrigir ou expandir sem quebrar o contrato.

Exemplo:

```text
Use flow-diagram-ai to fix this invalid snapshot and keep the same architecture.
```

## Estrutura do repositório

```text
.
├── assets/                              # imagens usadas no README
├── skills/
│   └── flow-diagram-ai/
│       ├── SKILL.md
│       ├── agents/
│       ├── assets/
│       ├── examples/
│       ├── references/
│       ├── scripts/
│       └── starter/dashboard-frontend/
└── README.md
```

## Instalação

Copie a skill para a pasta de skills do Codex:

```bash
mkdir -p ~/.codex/skills
cp -R skills/flow-diagram-ai ~/.codex/skills/flow-diagram-ai
```

Depois disso, a skill pode ser chamada pelo identificador `flow-diagram-ai`.

## Conteúdo principal da skill

Dentro de [skills/flow-diagram-ai](/Users/macielcr7/Desktop/dev/maciel/Flow-Chart-AI/skills/flow-diagram-ai):

- [SKILL.md](/Users/macielcr7/Desktop/dev/maciel/Flow-Chart-AI/skills/flow-diagram-ai/SKILL.md)
  Regras de execução, modos de uso e fluxo principal.

- [references/snapshot-spec.md](/Users/macielcr7/Desktop/dev/maciel/Flow-Chart-AI/skills/flow-diagram-ai/references/snapshot-spec.md)
  Contrato formal do snapshot JSON.

- [references/import-checklist.md](/Users/macielcr7/Desktop/dev/maciel/Flow-Chart-AI/skills/flow-diagram-ai/references/import-checklist.md)
  Checklist para evitar falhas de importação.

- [examples](/Users/macielcr7/Desktop/dev/maciel/Flow-Chart-AI/skills/flow-diagram-ai/examples)
  Biblioteca de snapshots válidos para cenários reais.

- [scripts/validate_snapshot.py](/Users/macielcr7/Desktop/dev/maciel/Flow-Chart-AI/skills/flow-diagram-ai/scripts/validate_snapshot.py)
  Validador do contrato JSON.

- [scripts/materialize_starter.py](/Users/macielcr7/Desktop/dev/maciel/Flow-Chart-AI/skills/flow-diagram-ai/scripts/materialize_starter.py)
  Script que materializa o projeto frontend com o snapshot injetado.

- [starter/dashboard-frontend](/Users/macielcr7/Desktop/dev/maciel/Flow-Chart-AI/skills/flow-diagram-ai/starter/dashboard-frontend)
  Starter do dashboard, pronto para uso local.

## Validação

Smoke test completo:

```bash
python3 skills/flow-diagram-ai/scripts/smoke_test.py
```

Validação de um snapshot específico:

```bash
python3 skills/flow-diagram-ai/scripts/validate_snapshot.py path/to/file.json
```

## Leitura dos exemplos visuais

### Exemplo 1: visão operacional de um gateway selecionado

![Example 1](./assets/example1.png)

Esta imagem mostra bem a leitura operacional do dashboard:

- à esquerda, a paleta de componentes disponíveis para arrastar ao canvas;
- no centro, um sistema distribuído com múltiplos serviços, banco, storage, fila e observabilidade;
- à direita, o inspector focado no `vms-gateway`.

O ponto mais importante aqui é que o painel lateral não mostra apenas os dados do card. Ele expõe:

- endpoints do componente selecionado;
- fluxos de entrada e saída;
- ações rápidas como editar, duplicar, centralizar e remover.

É a visão mais próxima de “inspeção de um nó”.

### Exemplo 2: visão sistêmica do diagrama completo

![Example 2](./assets/example2.png)

Nesta imagem, o foco está menos em um componente específico e mais no sistema como conjunto:

- o canvas mostra a topologia completa;
- o mini-map ajuda a navegar em diagramas maiores;
- o inspector opera como catálogo de endpoints;
- a barra superior resume o estado do snapshot e o volume do sistema analisado.

É a melhor imagem para entender que o editor não é um canvas solto. Ele também funciona como console de leitura da arquitetura.

### Exemplo 3: leitura contextual de relacionamentos

![Example 3](./assets/example3.png)

Esta imagem evidencia o comportamento contextual da seleção:

- um componente está em foco;
- fluxos relacionados ficam destacados;
- elementos sem vínculo visual com a seleção ficam atenuados;
- o inspector acompanha o nó ativo e mostra seus relacionamentos.

Esse comportamento melhora muito a leitura de grafos médios e grandes, porque reduz ruído visual sem esconder o restante da arquitetura.

## Resumo

Esta skill existe para fechar um fluxo completo:

1. entender uma arquitetura;
2. transformar isso em um snapshot consistente;
3. validar o contrato;
4. abrir esse resultado em um dashboard visual utilizável;
5. continuar a edição no canvas ou no JSON bruto.

O valor real não está apenas em “gerar um JSON”, mas em manter o JSON, o editor e o starter funcionando como uma única ferramenta de trabalho.
