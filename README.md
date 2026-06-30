# FITNESS OS

Sistema pessoal focado em treino de hoje, cargas por exercício, peso corporal, cardio e calendário de consistência.

## Fluxos principais

- Treino de hoje em destaque.
- Registro de séries, reps e carga em kg por exercício.
- Peso corporal registrado separadamente por data.
- Cardio registrado separadamente por data.
- Calendário estilo GitHub com os últimos 365 dias.
- Gráficos de peso, volume de treino e cardio.
- Layout responsivo com navegação inferior no celular.

## Backend

O app está preparado para usar Supabase como backend principal.

1. Crie um projeto no Supabase.
2. Rode o SQL em `src/database/schema.sql`.
3. Configure no Vercel:

```txt
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Sem essas variáveis, o app usa `localStorage` apenas como fallback de desenvolvimento.

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
