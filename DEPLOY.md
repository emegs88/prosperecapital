# 🚀 Guia de Deploy - Prospere Capital

## Opção 1: Deploy na Vercel (Recomendado para Next.js)

### Passo a Passo:

1. **Acesse a Vercel:**
   - Vá para https://vercel.com
   - Faça login com sua conta GitHub

2. **Importe o Projeto:**
   - Clique em "Add New Project"
   - Selecione o repositório `prosperecapital`
   - A Vercel detectará automaticamente que é um projeto Next.js

3. **Configurações:**
   - Framework Preset: Next.js (já detectado)
   - Build Command: `npm run build` (padrão)
   - Output Directory: `.next` (padrão)
   - Install Command: `npm install` (padrão)
   - Root Directory: `./` (padrão)

4. **Variáveis de Ambiente (se necessário):**
   - Por enquanto não há variáveis de ambiente necessárias
   - Quando integrar APIs reais, adicione aqui

5. **Deploy:**
   - Clique em "Deploy"
   - Aguarde o build completar
   - Seu site estará disponível em `https://prosperecapital.vercel.app` (ou URL personalizada)

### Deploy Automático:
- Toda vez que você fizer `git push` para a branch `main`, a Vercel fará deploy automaticamente

---

## Opção 2: Deploy Manual via Vercel CLI

1. **Instale a Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Faça login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Deploy de Produção:**
   ```bash
   vercel --prod
   ```

---

## Opção 3: Netlify

1. **Acesse Netlify:**
   - Vá para https://netlify.com
   - Faça login com GitHub

2. **Importe o Projeto:**
   - "Add new site" → "Import an existing project"
   - Selecione o repositório

3. **Configurações:**
   - Build command: `npm run build`
   - Publish directory: `.next`

---

## Opção 4: Deploy em Servidor Próprio

### Requisitos:
- Node.js 18+ instalado
- PM2 para gerenciar o processo (opcional)

### Comandos:
```bash
# Build do projeto
npm run build

# Iniciar em produção
npm start

# Ou com PM2
pm2 start npm --name "prospere-capital" -- start
```

---

## 📝 Checklist Pré-Deploy

- [x] Build local funcionando (`npm run build`)
- [x] Código commitado no GitHub
- [x] Arquivo `vercel.json` criado
- [ ] Testar todas as páginas principais
- [ ] Verificar se não há erros no console
- [ ] Configurar domínio personalizado (opcional)

---

## 🔧 Troubleshooting

### Erro de Build:
- Verifique se todas as dependências estão no `package.json`
- Execute `npm run build` localmente para ver erros

### Erro 404 em rotas:
- Verifique se está usando `next/link` para navegação
- Certifique-se de que todas as rotas estão em `app/`

### Variáveis de Ambiente:
- Configure na Vercel: Settings → Environment Variables

---

## 📞 Suporte

Para problemas com deploy, verifique:
1. Logs do build na Vercel
2. Console do navegador
3. Logs do servidor
