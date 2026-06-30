# FITNESS OS

Sistema pessoal focado em treino, cargas, peso corporal, cardio e calendário de consistência.

## O que existe agora

- Home centrada no treino de hoje.
- Cadastro de carga por exercício: séries, reps e kg.
- Botão `Treinei hoje`.
- Registro opcional de peso corporal no dia.
- Registro opcional de cardio em minutos.
- Calendário estilo GitHub com os últimos 365 dias.
- Gráficos de peso, volume de treino e cardio.
- Dados começam vazios e são salvos no navegador via `localStorage`.

## O que foi removido

- Avaliações.
- Fotos.
- Nutrição.
- Sono.
- Água.
- Conquistas.
- Notificações.
- Dados demonstrativos/falsos.

## Como rodar

```bash
npm install
npm run dev
```

## Deploy Vercel

```txt
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

## Observação

O Supabase está preparado, mas o app atual salva localmente. Quando quiser transformar em banco real, use o schema em `src/database/schema.sql`.
