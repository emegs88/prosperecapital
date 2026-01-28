import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Webhook para receber notificações de pagamento PIX do C6 Bank
 * POST /api/pix/webhook
 * 
 * O C6 Bank enviará notificações quando um pagamento for confirmado
 */
export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-c6-signature');
    const body = await request.text();
    
    // Em produção, valide a assinatura do webhook
    // const isValid = validateWebhookSignature(body, signature);
    // if (!isValid) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    const data = JSON.parse(body);
    
    // Tipos de eventos do C6 Bank
    const eventType = data.type || data.event;
    const transactionId = data.transactionId || data.id;
    
    console.log('Webhook C6 Bank recebido:', { eventType, transactionId, data });

    // Processar diferentes tipos de eventos
    switch (eventType) {
      case 'pix.payment.received':
      case 'payment.confirmed':
        // Pagamento confirmado
        await handlePaymentConfirmed(transactionId, data);
        break;
      
      case 'pix.payment.expired':
      case 'payment.expired':
        // Pagamento expirado
        await handlePaymentExpired(transactionId, data);
        break;
      
      case 'pix.payment.cancelled':
      case 'payment.cancelled':
        // Pagamento cancelado
        await handlePaymentCancelled(transactionId, data);
        break;
      
      default:
        console.log('Evento não tratado:', eventType);
    }

    // Sempre retornar 200 para o C6 Bank
    return NextResponse.json({ 
      success: true,
      message: 'Webhook recebido com sucesso' 
    });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    // Retornar 200 mesmo em caso de erro para evitar retentativas
    return NextResponse.json({ 
      success: false,
      error: 'Erro ao processar webhook' 
    });
  }
}

/**
 * Processar pagamento confirmado
 */
async function handlePaymentConfirmed(transactionId: string, data: any) {
  // Aqui você deve:
  // 1. Buscar a transação no banco de dados
  // 2. Atualizar o status para 'paid'
  // 3. Creditar o valor na conta do usuário
  // 4. Enviar notificação por email/push
  
  console.log('Pagamento confirmado:', transactionId, data);
  
  // Exemplo de integração com banco de dados:
  // await db.transactions.update({
  //   where: { transactionId },
  //   data: {
  //     status: 'paid',
  //     paidAt: new Date(),
  //     amount: data.amount,
  //   }
  // });
  
  // await db.accounts.update({
  //   where: { userId: data.userId },
  //   data: {
  //     balance: { increment: data.amount }
  //   }
  // });
}

/**
 * Processar pagamento expirado
 */
async function handlePaymentExpired(transactionId: string, data: any) {
  console.log('Pagamento expirado:', transactionId);
  
  // Atualizar status no banco de dados
  // await db.transactions.update({
  //   where: { transactionId },
  //   data: { status: 'expired' }
  // });
}

/**
 * Processar pagamento cancelado
 */
async function handlePaymentCancelled(transactionId: string, data: any) {
  console.log('Pagamento cancelado:', transactionId);
  
  // Atualizar status no banco de dados
  // await db.transactions.update({
  //   where: { transactionId },
  //   data: { status: 'cancelled' }
  // });
}

/**
 * Validar assinatura do webhook (implementar conforme documentação C6 Bank)
 */
function validateWebhookSignature(body: string, signature: string | null): boolean {
  if (!signature) return false;
  
  // Implementar validação conforme documentação C6 Bank
  // const secret = process.env.C6_WEBHOOK_SECRET;
  // const expectedSignature = crypto
  //   .createHmac('sha256', secret)
  //   .update(body)
  //   .digest('hex');
  // return signature === expectedSignature;
  
  return true; // Por enquanto, aceitar todas as requisições
}
