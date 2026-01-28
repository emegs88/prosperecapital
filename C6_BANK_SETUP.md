# 🏦 Configuração API C6 Bank - Chaves PIX

## 📋 Pré-requisitos

1. Conta no C6 Bank (conta empresarial)
2. Acesso ao portal de desenvolvedores: https://developers.c6bank.com.br/
3. Credenciais de API (Client ID e Client Secret)

---

## 🔑 Como Obter as Credenciais

### Passo 1: Acessar Portal de Desenvolvedores
1. Acesse: https://developers.c6bank.com.br/
2. Faça login com sua conta C6 Bank
3. Vá para "Minhas Aplicações"

### Passo 2: Criar Nova Aplicação
1. Clique em "Nova Aplicação"
2. Preencha os dados:
   - **Nome**: Prospere Capital
   - **Descrição**: Plataforma de investimentos
   - **Tipo**: Aplicação Web
   - **Redirect URI**: `https://seu-dominio.com/callback` (ou `http://localhost:3000/callback` para desenvolvimento)

### Passo 3: Obter Credenciais
Após criar a aplicação, você receberá:
- **Client ID**: Identificador público da aplicação
- **Client Secret**: Chave secreta (mantenha em segurança!)

### Passo 4: Solicitar Acesso à API PIX
1. No portal, vá para "APIs Disponíveis"
2. Solicite acesso à API PIX
3. Aguarde aprovação (pode levar alguns dias)

---

## ⚙️ Configuração no Projeto

### 1. Criar arquivo `.env.local`

Na raiz do projeto, crie o arquivo `.env.local`:

```bash
# C6 Bank API
NEXT_PUBLIC_C6_CLIENT_ID=seu_client_id_aqui
C6_CLIENT_SECRET=seu_client_secret_aqui
NEXT_PUBLIC_C6_ENVIRONMENT=sandbox
C6_PIX_KEY=prosperity.participacoes@gmail.com
```

**⚠️ IMPORTANTE:**
- `NEXT_PUBLIC_*` são variáveis expostas ao cliente (não coloque secrets aqui!)
- `C6_CLIENT_SECRET` deve estar SEM o prefixo `NEXT_PUBLIC_` (será usado apenas no servidor)
- Para produção, use `NEXT_PUBLIC_C6_ENVIRONMENT=production`

### 2. Variáveis de Ambiente por Ambiente

#### Desenvolvimento (`.env.local`):
```env
NEXT_PUBLIC_C6_CLIENT_ID=dev_client_id
C6_CLIENT_SECRET=dev_client_secret
NEXT_PUBLIC_C6_ENVIRONMENT=sandbox
```

#### Produção (Vercel/Netlify):
Configure nas variáveis de ambiente da plataforma:
- `NEXT_PUBLIC_C6_CLIENT_ID`
- `C6_CLIENT_SECRET`
- `NEXT_PUBLIC_C6_ENVIRONMENT=production`
- `C6_PIX_KEY` (chave PIX da empresa)

---

## 🔐 Segurança

### ⚠️ NUNCA faça:
- ❌ Commitar `.env.local` no Git
- ❌ Expor `C6_CLIENT_SECRET` no código frontend
- ❌ Usar credenciais de produção em desenvolvimento

### ✅ SEMPRE faça:
- ✅ Adicionar `.env.local` ao `.gitignore`
- ✅ Usar variáveis de ambiente no servidor
- ✅ Rotacionar credenciais periodicamente
- ✅ Usar ambiente sandbox para testes

---

## 📝 Uso da API

### Exemplo: Gerar QR Code PIX

```typescript
import { generatePixQrCode } from '@/lib/c6bank';

// Gerar QR Code para pagamento (Cobrança Imediata)
const qrCode = await generatePixQrCode(
  1000.00, // Valor
  'Depósito Prospere Capital', // Descrição
  'João Silva', // Nome do pagador (opcional)
  '123.456.789-00' // CPF/CNPJ (opcional)
);

console.log('QR Code:', qrCode?.qrCode);
console.log('TXID:', qrCode?.txid);
```

### Exemplo: Consultar Pagamento

```typescript
import { checkPixPayment, getPixCob } from '@/lib/c6bank';

// Consultar status via txid
const status = await checkPixPayment('txid-da-cobranca');
if (status?.status === 'paid') {
  console.log('Pagamento confirmado!');
}

// Ou consultar cobrança completa
const cob = await getPixCob('txid-da-cobranca');
console.log('Status:', cob?.status);
console.log('QR Code:', cob?.pixCopiaECola);
```

---

## 🧪 Testes em Sandbox

O ambiente sandbox permite testar sem movimentar dinheiro real:

1. Use `NEXT_PUBLIC_C6_ENVIRONMENT=sandbox`
2. As chaves PIX geradas são apenas para teste
3. Os pagamentos não são processados de verdade

---

## 📚 Documentação Oficial

- **Portal de Desenvolvedores**: https://developers.c6bank.com.br/
- **API Base URLs:**
  - Sandbox: `https://baas-api-sandbox.c6bank.info`
  - Produção: `https://baas-api.c6bank.info`
- **Endpoints principais:**
  - Criar cobrança: `PUT /v2/pix/cob/{{txid}}` ou `POST /v2/pix/cob/`
  - Consultar cobrança: `GET /v2/pix/cob/{{txid}}`
  - Configurar webhook: `PUT /v2/pix/webhook/{{chave_pix}}`
- **Suporte**: suporte@c6bank.com.br

---

## 🚀 Próximos Passos

1. ✅ Configurar credenciais no `.env.local`
2. ✅ Testar geração de chave PIX em sandbox
3. ✅ Integrar na página de depósitos
4. ✅ Implementar webhook para notificações de pagamento
5. ✅ Configurar credenciais de produção na Vercel

---

## 🔄 Webhook para Notificações

Para receber notificações de pagamento em tempo real:

1. **Configurar Webhook via API:**
```typescript
import { setWebhook } from '@/lib/c6bank';

await setWebhook(
  'https://seu-dominio.com/api/pix/webhook',
  'sua-chave-pix'
);
```

2. **Webhook já implementado:**
   - Rota: `POST /api/pix/webhook`
   - Processa eventos: `pix.payment.received`, `pix.payment.expired`, `pix.payment.cancelled`
   - Valida assinatura (implementar conforme documentação C6 Bank)
   - Atualiza status no banco de dados

---

## ❓ Troubleshooting

### Erro: "Invalid credentials"
- Verifique se `C6_CLIENT_SECRET` está correto
- Confirme que não há espaços extras nas variáveis

### Erro: "Access denied"
- Verifique se o acesso à API PIX foi aprovado
- Confirme que está usando o ambiente correto (sandbox/production)

### Erro: "Token expired"
- O token expira após 1 hora
- A função `getC6Token()` renova automaticamente

---

**Última atualização**: Janeiro 2025
