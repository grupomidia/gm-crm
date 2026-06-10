# GM Connect — CRM Forms do Grupo Mídia

MVP em React + JavaScript + Supabase gratuito, pronto para deploy na Vercel ou Netlify.

## Recursos

- Formulário público por evento: `/form/healthcare-conference-2026`
- Cadastro/atualização de contato
- Registro de resposta no Supabase
- Dashboard administrativo simples
- Busca por nome, empresa ou e-mail
- Exportação CSV
- Layout responsivo

## Como rodar localmente

```bash
npm install
cp .env.example .env
npm run dev
```

Preencha `.env` com os dados do Supabase.

## Como configurar o Supabase

1. Crie um projeto gratuito em Supabase.
2. Vá em SQL Editor.
3. Cole e execute o arquivo `supabase/schema.sql`.
4. Vá em Project Settings > API.
5. Copie:
   - Project URL para `VITE_SUPABASE_URL`
   - anon public key para `VITE_SUPABASE_ANON_KEY`

## Deploy na Vercel

1. Suba este projeto para GitHub.
2. Importe o repositório na Vercel.
3. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Build command: `npm run build`
5. Output directory: `dist`

## URLs principais

- `/` página inicial
- `/form/healthcare-conference-2026` formulário público
- `/admin` painel simples
