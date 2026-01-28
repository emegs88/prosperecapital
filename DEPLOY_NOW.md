# 🚀 Deploy Rápido - Prospere Capital

## ✅ Status Atual
- ✅ Código commitado no GitHub
- ✅ `vercel.json` configurado
- ✅ Build local funcionando
- ✅ Todas as funcionalidades implementadas

---

## 🎯 Deploy na Vercel (Recomendado - 5 minutos)

### Opção 1: Via Interface Web (Mais Fácil)

1. **Acesse:** https://vercel.com
2. **Faça login** com sua conta GitHub
3. **Clique em:** "Add New Project"
4. **Importe o repositório:** `emegs88/prosperecapital`
5. **Configurações automáticas:**
   - Framework: Next.js (detectado automaticamente)
   - Build Command: `npm run build` ✅
   - Output Directory: `.next` ✅
   - Install Command: `npm install` ✅

6. **Variáveis de Ambiente (se necessário):**
   - `NEXT_PUBLIC_C6_CLIENT_ID` (se usar API C6 Bank)
   - `C6_CLIENT_SECRET` (se usar API C6 Bank)
   - `NEXT_PUBLIC_C6_ENVIRONMENT=sandbox`
   - `C6_PIX_KEY` (opcional)

7. **Clique em:** "Deploy"
8. **Aguarde** o build (2-3 minutos)
9. **Pronto!** Seu site estará em: `https://prosperecapital.vercel.app`

---

### Opção 2: Via CLI (Terminal)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Fazer login
vercel login

# 3. Deploy
vercel

# 4. Deploy de produção
vercel --prod
```

---

## 📋 Checklist Pré-Deploy

- [x] Código no GitHub
- [x] `vercel.json` configurado
- [x] Build local funcionando
- [ ] Variáveis de ambiente configuradas (se necessário)
- [ ] Domínio personalizado (opcional)

---

## 🔧 Após o Deploy

### 1. Configurar Variáveis de Ambiente
Se precisar usar a API C6 Bank, configure na Vercel:
- Settings → Environment Variables
- Adicione as variáveis necessárias

### 2. Configurar Webhook C6 Bank
Após o deploy, configure o webhook:
```
https://seu-dominio.vercel.app/api/pix/webhook
```

### 3. Testar
- Acesse a URL fornecida pela Vercel
- Teste login: `emerson@prospere.com.br` / `142827`
- Verifique todas as páginas

---

## 🌐 Domínio Personalizado (Opcional)

1. Na Vercel: Settings → Domains
2. Adicione seu domínio
3. Configure DNS conforme instruções

---

## 📊 Monitoramento

Após o deploy, você terá acesso a:
- Logs em tempo real
- Analytics
- Performance metrics
- Deploy history

---

## 🆘 Troubleshooting

### Erro de Build:
- Verifique os logs na Vercel
- Teste build local: `npm run build`

### Variáveis de Ambiente:
- Certifique-se de que estão configuradas
- Use `NEXT_PUBLIC_*` apenas para variáveis públicas

### Erro 404:
- Verifique se todas as rotas estão em `app/`
- Use `next/link` para navegação

---

**Pronto para deploy! 🚀**
