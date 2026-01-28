/**
 * Integração com API C6 Bank para geração de chaves PIX
 * Documentação: https://developers.c6bank.com.br/
 */

interface C6BankConfig {
  clientId: string;
  clientSecret: string;
  environment: 'sandbox' | 'production';
  accountId?: string;
}

interface PixKey {
  key: string;
  keyType: 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'RANDOM';
  createdAt?: Date;
}

interface PixPayment {
  amount: number;
  description: string;
  payerName?: string;
  payerDocument?: string;
}

interface C6TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface C6PixKeyResponse {
  key: string;
  keyType: string;
  createdAt: string;
}

interface C6PixQrCodeResponse {
  qrCode: string;
  qrCodeImage: string;
  transactionId: string;
  expiresAt: string;
}

// Configuração padrão (será sobrescrita por variáveis de ambiente)
let c6Config: C6BankConfig = {
  clientId: process.env.NEXT_PUBLIC_C6_CLIENT_ID || '',
  clientSecret: process.env.C6_CLIENT_SECRET || '',
  environment: (process.env.NEXT_PUBLIC_C6_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
  accountId: process.env.C6_ACCOUNT_ID,
};

const C6_API_BASE = {
  sandbox: 'https://api-sandbox.c6bank.com.br',
  production: 'https://api.c6bank.com.br',
};

/**
 * Obter token de autenticação OAuth2
 */
export async function getC6Token(): Promise<string | null> {
  try {
    const response = await fetch(`${C6_API_BASE[c6Config.environment]}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${c6Config.clientId}:${c6Config.clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'pix.read pix.write',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('C6 Bank Token Error:', error);
      return null;
    }

    const data: C6TokenResponse = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Erro ao obter token C6 Bank:', error);
    return null;
  }
}

/**
 * Criar chave PIX
 */
export async function createPixKey(keyType: 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'RANDOM' = 'RANDOM'): Promise<PixKey | null> {
  try {
    const token = await getC6Token();
    if (!token) return null;

    const response = await fetch(`${C6_API_BASE[c6Config.environment]}/pix/keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: keyType,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('C6 Bank Create Key Error:', error);
      return null;
    }

    const data: C6PixKeyResponse = await response.json();
    return {
      key: data.key,
      keyType: data.keyType as PixKey['keyType'],
      createdAt: new Date(data.createdAt),
    };
  } catch (error) {
    console.error('Erro ao criar chave PIX:', error);
    return null;
  }
}

/**
 * Gerar QR Code PIX (Cobrança Imediata)
 */
export async function generatePixQrCode(payment: PixPayment): Promise<C6PixQrCodeResponse | null> {
  try {
    const token = await getC6Token();
    if (!token) return null;

    const response = await fetch(`${C6_API_BASE[c6Config.environment]}/pix/qrcode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount: payment.amount,
        description: payment.description,
        payer: payment.payerName ? {
          name: payment.payerName,
          document: payment.payerDocument,
        } : undefined,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('C6 Bank QR Code Error:', error);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao gerar QR Code PIX:', error);
    return null;
  }
}

/**
 * Consultar chaves PIX cadastradas
 */
export async function listPixKeys(): Promise<PixKey[]> {
  try {
    const token = await getC6Token();
    if (!token) return [];

    const response = await fetch(`${C6_API_BASE[c6Config.environment]}/pix/keys`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return [];
    }

    const data: C6PixKeyResponse[] = await response.json();
    return data.map(key => ({
      key: key.key,
      keyType: key.keyType as PixKey['keyType'],
      createdAt: new Date(key.createdAt),
    }));
  } catch (error) {
    console.error('Erro ao listar chaves PIX:', error);
    return [];
  }
}

/**
 * Consultar status de pagamento PIX
 */
export async function checkPixPayment(transactionId: string): Promise<{
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
  paidAt?: Date;
  amount?: number;
} | null> {
  try {
    const token = await getC6Token();
    if (!token) return null;

    const response = await fetch(`${C6_API_BASE[c6Config.environment]}/pix/payments/${transactionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return {
      status: data.status,
      paidAt: data.paidAt ? new Date(data.paidAt) : undefined,
      amount: data.amount,
    };
  } catch (error) {
    console.error('Erro ao consultar pagamento PIX:', error);
    return null;
  }
}

/**
 * Configurar credenciais C6 Bank
 */
export function setC6Config(config: Partial<C6BankConfig>) {
  c6Config = { ...c6Config, ...config };
}

/**
 * Obter configuração atual
 */
export function getC6Config(): C6BankConfig {
  return { ...c6Config };
}
