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
C6_ACCOUNT_ID=seu_account_id_aqui
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
- `C6_ACCOUNT_ID`

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

### Exemplo: Gerar Chave PIX

```typescript
import { createPixKey, generatePixQrCode } from '@/lib/c6bank';

// Criar chave PIX aleatória
const pixKey = await createPixKey('RANDOM');
console.log('Chave PIX:', pixKey?.key);

// Gerar QR Code para pagamento
const qrCode = await generatePixQrCode({
  amount: 1000.00,
  description: 'Depósito Prospere Capital',
  payerName: 'João Silva',
  payerDocument: '123.456.789-00',
});
```

### Exemplo: Consultar Pagamento

```typescript
import { checkPixPayment } from '@/lib/c6bank';

const status = await checkPixPayment('transaction-id');
if (status?.status === 'paid') {
  console.log('Pagamento confirmado!');
}
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
- **Documentação API PIX**: https://developers.c6bank.com.br/docs/pix
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

Para receber notificações de pagamento em tempo real, configure um webhook:

1. No portal C6 Bank, configure a URL do webhook
2. Crie uma rota API em `/app/api/c6/webhook/route.ts`
3. Valide a assinatura da requisição
4. Atualize o status do pagamento no banco de dados

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
