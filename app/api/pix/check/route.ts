import { NextRequest, NextResponse } from 'next/server';
import { checkPixPayment } from '@/lib/c6bank';

/**
 * API Route para verificar status de pagamento PIX
 * GET /api/pix/check?txid=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const txid = searchParams.get('txid') || searchParams.get('transactionId');

    if (!txid) {
      return NextResponse.json(
        { error: 'txid é obrigatório' },
        { status: 400 }
      );
    }

    const status = await checkPixPayment(txid);

    if (!status) {
      return NextResponse.json(
        { error: 'Transação não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: status,
    });
  } catch (error) {
    console.error('Erro ao verificar pagamento PIX:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
