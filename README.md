# FITNESS OS

Dashboard pessoal para treino, cardio, peso, evolução corporal e consistência.

## Stack

- React + TypeScript + Vite
- TailwindCSS + componentes estilo Shadcn/UI
- Framer Motion + Lucide Icons
- React Router + React Query + Zustand
- Supabase preparado em `src/services/supabase.ts`
- Recharts, date-fns, React Hook Form e Zod preparados no projeto
- PWA com manifesto e service worker offline

## Estrutura

```txt
src/
  api/          camada de acesso a dados
  app/          app shell e rotas
  components/   UI, charts e calendário
  constants/    navegação e treinos
  contexts/     providers globais
  database/     seed e schema de referência
  features/     módulos e widgets por domínio
  hooks/        hooks de leitura
  layouts/      layout principal
  models/       modelos auxiliares
  pages/        páginas roteadas
  services/     PWA, Supabase e Coach IA
  stores/       Zustand
  theme/        tokens visuais
  types/        tipos do domínio fitness
  utils/        helpers
```

## Como rodar

Instale Node.js LTS e depois execute:

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
npm run preview
```

## Módulos implementados nesta versão

- Home Dashboard com métricas reais, entrada rápida de dados, treino do dia, relatório do Coach IA, calendário tipo GitHub, volume semanal e gráfico de peso.
- Coach IA com relatório diário baseado nos dados.
- Calendário anual clicável com detalhes do dia.
- Treinos com rotina semanal, exercícios, carga, séries, RPE, descanso, histórico e PR.
- Timer com descanso, modo livre, Pomodoro, presets e ações de tela.
- Peso com gráfico, perda total, média semanal e projeção de meta.
- Analytics com radar de hábitos, volume semanal e cards de correlação.
- Dados começam vazios e são salvos no navegador com `localStorage`.
- Páginas preparadas para Avaliações, Cardio, Conquistas, Metas, Notificações e Configurações.
