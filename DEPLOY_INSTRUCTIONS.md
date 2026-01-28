# 🚀 INSTRUÇÕES DE DEPLOY - PROSPERE CAPITAL

## ✅ Tudo Pronto para Deploy!

Seu código está:
- ✅ Commitado no GitHub: `https://github.com/emegs88/prosperecapital.git`
- ✅ Configurado com `vercel.json`
- ✅ Build local funcionando

---

## 🎯 OPÇÃO 1: Deploy via Interface Web (MAIS FÁCIL - 5 minutos)

### Passos:

1. **Acesse:** https://vercel.com
2. **Faça login** com sua conta GitHub (mesma do repositório)
3. **Clique em:** "Add New Project" ou "Import Project"
4. **Selecione o repositório:** `emegs88/prosperecapital`
5. **A Vercel detectará automaticamente:**
   - Framework: Next.js ✅
   - Build Command: `npm run build` ✅
   - Output Directory: `.next` ✅

6. **Variáveis de Ambiente (OPCIONAL - só se usar API C6 Bank):**
   - Clique em "Environment Variables"
   - Adicione (se necessário):
     ```
     NEXT_PUBLIC_C6_CLIENT_ID=seu_client_id
     C6_CLIENT_SECRET=seu_client_secret
     NEXT_PUBLIC_C6_ENVIRONMENT=sandbox
     C6_PIX_KEY=sua_chave_pix
     ```

7. **Clique em:** "Deploy"
8. **Aguarde 2-3 minutos** para o build
9. **Pronto!** Seu site estará em: `https://prosperecapital.vercel.app`

---

## 🎯 OPÇÃO 2: Deploy via Terminal (CLI)

Execute no terminal:

```bash
cd /Users/prospere/Desktop/fundoinvestimentos

# Deploy (primeira vez - vai pedir login)
npx vercel

# Deploy de produção
npx vercel --prod
```

**Nota:** Na primeira execução, você precisará:
1. Fazer login na Vercel (abrirá o navegador)
2. Autorizar o acesso
3. Confirmar o projeto

---

## 📋 Checklist Pós-Deploy

Após o deploy, verifique:

- [ ] Site acessível na URL fornecida
- [ ] Login funcionando: `emerson@prospere.com.br` / `142827`
- [ ] Todas as páginas carregando
- [ ] Menu do usuário funcionando (Perfil, Configurações, Sair)
- [ ] Página de depósito funcionando
- [ ] Dashboard com gráficos

---

## 🔧 Configurações Importantes

### Variáveis de Ambiente (se usar C6 Bank):
Configure na Vercel: **Settings → Environment Variables**

### Webhook C6 Bank (após deploy):
URL do webhook: `https://seu-dominio.vercel.app/api/pix/webhook`

---

## 🌐 Domínio Personalizado (Opcional)

1. Na Vercel: **Settings → Domains**
2. Adicione seu domínio (ex: `app.prosperecapital.com.br`)
3. Configure DNS conforme instruções da Vercel

---

## 📊 Monitoramento

Após o deploy, você terá acesso a:
- ✅ Logs em tempo real
- ✅ Analytics
- ✅ Performance metrics
- ✅ Deploy history
- ✅ Rollback de versões anteriores

---

## 🆘 Problemas Comuns

### Build falha:
- Verifique os logs na Vercel
- Teste localmente: `npm run build`

### Erro 404 em rotas:
- Certifique-se de que todas as páginas estão em `app/`
- Use `next/link` para navegação

### Variáveis de ambiente não funcionam:
- Use `NEXT_PUBLIC_*` apenas para variáveis públicas
- Variáveis privadas não precisam do prefixo

---

## 🎉 Próximos Passos

1. ✅ Fazer deploy
2. ✅ Testar todas as funcionalidades
3. ✅ Configurar domínio personalizado (opcional)
4. ✅ Configurar variáveis de ambiente (se necessário)
5. ✅ Configurar webhook C6 Bank (se usar API)

---

**🚀 Boa sorte com o deploy!**
