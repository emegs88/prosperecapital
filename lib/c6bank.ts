/**
 * Integração com API C6 Bank para geração de chaves PIX
 * Documentação baseada na collection Postman oficial
 * Base URL: baas-api-sandbox.c6bank.info (sandbox) | baas-api.c6bank.info (production)
 */

import { companyData } from './companyData';

interface C6BankConfig {
  clientId: string;
  clientSecret: string;
  environment: 'sandbox' | 'production';
  pixKey?: string; // Chave PIX da empresa
}

interface PixCobRequest {
  calendario: {
    expiracao: number; // Segundos até expiração (ex: 172800 = 2 dias)
  };
  devedor?: {
    cpf?: string;
    cnpj?: string;
    nome: string;
    logradouro?: string;
    cidade?: string;
    uf?: string;
    cep?: string;
  };
  valor: {
    original: string; // Valor em formato "100.00"
    modalidadeAlteracao?: number; // 0 = não permite alteração, 1 = permite
  };
  chave: string; // Chave PIX
  solicitacaoPagador?: string;
  infoAdicionais?: Array<{
    nome: string;
    valor: string;
  }>;
}

interface PixCobResponse {
  calendario: {
    criacao: string;
    expiracao: number;
  };
  txid: string;
  revisao: number;
  loc: {
    id: number;
    location: string;
    tipoCob: string;
    criacao: string;
  };
  location: string;
  status: string;
  devedor?: {
    cpf?: string;
    cnpj?: string;
    nome: string;
  };
  valor: {
    original: string;
  };
  chave: string;
  solicitacaoPagador?: string;
  infoAdicionais?: Array<{
    nome: string;
    valor: string;
  }>;
  pixCopiaECola?: string; // QR Code em formato string
}

interface PixLocationResponse {
  id: number;
  location: string;
  tipoCob: string;
  criacao: string;
}

interface C6TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Configuração padrão (será sobrescrita por variáveis de ambiente)
let c6Config: C6BankConfig = {
  clientId: process.env.NEXT_PUBLIC_C6_CLIENT_ID || '',
  clientSecret: process.env.C6_CLIENT_SECRET || '',
  environment: (process.env.NEXT_PUBLIC_C6_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
  pixKey: process.env.C6_PIX_KEY || companyData.pix.chave,
};

const C6_API_BASE = {
  sandbox: 'https://baas-api-sandbox.c6bank.info',
  production: 'https://baas-api.c6bank.info',
};

/**
 * Gerar txid aleatório (26 a 35 caracteres)
 */
function generateTxid(): string {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = Math.floor(Math.random() * (35 - 26 + 1)) + 26;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Obter token de autenticação OAuth2
 * Nota: A documentação não especifica o endpoint de OAuth, pode variar
 * Verifique a documentação oficial para o endpoint correto
 */
export async function getC6Token(): Promise<string | null> {
  try {
    // Tentar diferentes endpoints possíveis
    const endpoints = [
      '/oauth/token',
      '/v2/oauth/token',
      '/auth/token',
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${C6_API_BASE[c6Config.environment]}${endpoint}`, {
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

        if (response.ok) {
          const data: C6TokenResponse = await response.json();
          return data.access_token;
        }
      } catch (e) {
        continue;
      }
    }

    console.error('C6 Bank Token Error: Não foi possível obter token');
    return null;
  } catch (error) {
    console.error('Erro ao obter token C6 Bank:', error);
    return null;
  }
}

/**
 * Criar Location (URL para cobrança)
 */
export async function createPixLocation(tipoCob: 'cob' | 'cobv' = 'cob'): Promise<PixLocationResponse | null> {
  try {
    const token = await getC6Token();
    if (!token) return null;

    const response = await fetch(`${C6_API_BASE[c6Config.environment]}/v2/pix/loc/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        tipoCob,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('C6 Bank Create Location Error:', error);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao criar location PIX:', error);
    return null;
  }
}

/**
 * Criar Cobrança Imediata (com txid)
 * PUT /v2/pix/cob/{{txid}}
 */
export async function createPixCob(
  txid: string,
  request: PixCobRequest
): Promise<PixCobResponse | null> {
  try {
    const token = await getC6Token();
    if (!token) return null;

    const response = await fetch(`${C6_API_BASE[c6Config.environment]}/v2/pix/cob/${txid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('C6 Bank Create COB Error:', error);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao criar cobrança PIX:', error);
    return null;
  }
}

/**
 * Criar Cobrança Imediata (sem txid - o banco gera)
 * POST /v2/pix/cob/
 */
export async function createPixCobAuto(request: PixCobRequest): Promise<PixCobResponse | null> {
  try {
    const token = await getC6Token();
    if (!token) return null;

    const response = await fetch(`${C6_API_BASE[c6Config.environment]}/v2/pix/cob/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('C6 Bank Create COB Auto Error:', error);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao criar cobrança PIX:', error);
    return null;
  }
}

/**
 * Consultar Cobrança Imediata
 * GET /v2/pix/cob/{{txid}}
 */
export async function getPixCob(txid: string): Promise<PixCobResponse | null> {
  try {
    const token = await getC6Token();
    if (!token) return null;

    const response = await fetch(`${C6_API_BASE[c6Config.environment]}/v2/pix/cob/${txid}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('C6 Bank Get COB Error:', error);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao consultar cobrança PIX:', error);
    return null;
  }
}

/**
 * Gerar QR Code PIX (Cobrança Imediata) - Função simplificada
 */
export async function generatePixQrCode(
  amount: number,
  description: string,
  payerName?: string,
  payerDocument?: string
): Promise<{
  txid: string;
  qrCode: string;
  location: string;
  expiresAt: string;
} | null> {
  try {
    // Gerar txid
    const txid = generateTxid();
    
    // Preparar request
    const request: PixCobRequest = {
      calendario: {
        expiracao: 172800, // 2 dias em segundos
      },
      valor: {
        original: amount.toFixed(2),
        modalidadeAlteracao: 1, // Permite alteração
      },
      chave: c6Config.pixKey || '',
      solicitacaoPagador: description,
      infoAdicionais: [
        {
          nome: 'Descricao',
          valor: description,
        },
      ],
    };

    // Adicionar devedor se fornecido
    if (payerName) {
      request.devedor = {
        nome: payerName,
      };
      if (payerDocument) {
        if (payerDocument.length === 11) {
          request.devedor.cpf = payerDocument;
        } else {
          request.devedor.cnpj = payerDocument;
        }
      }
    }

    // Criar cobrança
    const cob = await createPixCob(txid, request);
    
    if (!cob || !cob.pixCopiaECola) {
      return null;
    }

    return {
      txid: cob.txid,
      qrCode: cob.pixCopiaECola,
      location: cob.location,
      expiresAt: new Date(
        new Date(cob.calendario.criacao).getTime() + cob.calendario.expiracao * 1000
      ).toISOString(),
    };
  } catch (error) {
    console.error('Erro ao gerar QR Code PIX:', error);
    return null;
  }
}

/**
 * Consultar status de pagamento PIX (via txid)
 */
export async function checkPixPayment(txid: string): Promise<{
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
  paidAt?: Date;
  amount?: number;
} | null> {
  try {
    const cob = await getPixCob(txid);
    if (!cob) return null;

    // Mapear status da API para nosso formato
    let status: 'pending' | 'paid' | 'expired' | 'cancelled' = 'pending';
    
    if (cob.status === 'CONCLUIDA') {
      status = 'paid';
    } else if (cob.status === 'REMOVIDA_PELO_USUARIO_RECEBEDOR' || cob.status === 'REMOVIDA_PELO_PSP') {
      status = 'cancelled';
    } else {
      // Verificar se expirou
      const expiracao = new Date(cob.calendario.criacao);
      expiracao.setSeconds(expiracao.getSeconds() + cob.calendario.expiracao);
      if (new Date() > expiracao) {
        status = 'expired';
      }
    }

    return {
      status,
      amount: parseFloat(cob.valor.original),
      // Se tiver pagamento, a API retornaria em outro endpoint
      // Por enquanto, assumimos que se status = 'paid', foi pago agora
      paidAt: status === 'paid' ? new Date() : undefined,
    };
  } catch (error) {
    console.error('Erro ao consultar pagamento PIX:', error);
    return null;
  }
}

/**
 * Consultar PIX recebidos
 * GET /v2/pix/pix?inicio=...&fim=...
 */
export async function listPixReceived(
  inicio: Date,
  fim: Date
): Promise<any[]> {
  try {
    const token = await getC6Token();
    if (!token) return [];

    const inicioStr = inicio.toISOString();
    const fimStr = fim.toISOString();

    const response = await fetch(
      `${C6_API_BASE[c6Config.environment]}/v2/pix/pix?inicio=${inicioStr}&fim=${fimStr}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.pix || [];
  } catch (error) {
    console.error('Erro ao listar PIX recebidos:', error);
    return [];
  }
}

/**
 * Configurar Webhook
 * PUT /v2/pix/webhook/{{sua_chave_pix}}
 */
export async function setWebhook(webhookUrl: string, pixKey: string): Promise<boolean> {
  try {
    const token = await getC6Token();
    if (!token) return false;

    const response = await fetch(
      `${C6_API_BASE[c6Config.environment]}/v2/pix/webhook/${pixKey}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          webhookUrl,
        }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error('Erro ao configurar webhook:', error);
    return false;
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

/**
 * Revisar cobrança (alterar dados)
 * PATCH /v2/pix/cob/{{txid}}
 */
export async function updatePixCob(
  txid: string,
  updates: Partial<PixCobRequest>
): Promise<PixCobResponse | null> {
  try {
    const token = await getC6Token();
    if (!token) return null;

    const response = await fetch(`${C6_API_BASE[c6Config.environment]}/v2/pix/cob/${txid}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('C6 Bank Update COB Error:', error);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar cobrança PIX:', error);
    return null;
  }
}
