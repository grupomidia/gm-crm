# GM Connect — CRM Forms do Grupo Mídia

[![CI](https://github.com/grupomidia/gm-crm/actions/workflows/ci.yml/badge.svg)](https://github.com/grupomidia/gm-crm/actions/workflows/ci.yml)

MVP em React + JavaScript + Supabase gratuito, pronto para deploy na Vercel.

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

Preencha o arquivo `.env` com os dados do Supabase.

## Configuração do Supabase

1. Crie um projeto gratuito em Supabase.
2. Acesse SQL Editor e execute o conteúdo de `supabase/schema.sql`.
3. Vá em Project Settings > API.
4. Copie:
   - `Project URL` para `VITE_SUPABASE_URL`
   - `anon public key` para `VITE_SUPABASE_ANON_KEY`
5. Se necessário, em Authentication > URL Configuration, defina o domínio do site e o redirecionamento para a URL da Vercel.

## Deploy na Vercel

1. Conecte este repositório ao GitHub.
2. Importe o projeto na Vercel.
3. Defina as variáveis de ambiente no painel da Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Configure os comandos de build:
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Faça o deploy e confirme a URL pública.

## Checklist pós-deploy

- A página inicial deve abrir corretamente em `/`.
- O formulário público deve funcionar em `/form/healthcare-conference-2026`.
- O painel administrativo deve carregar em `/admin`.
- Os dados devem ser salvos e lidos corretamente no Supabase.

## URLs principais

- `/` página inicial
- `/form/healthcare-conference-2026` formulário público
- `/admin` painel simples
