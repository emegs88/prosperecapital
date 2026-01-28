import { NextRequest, NextResponse } from 'next/server';
import { generatePixQrCode, createPixKey } from '@/lib/c6bank';

/**
 * API Route para gerar QR Code PIX dinâmico
 * POST /api/pix/generate
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, description, payerName, payerDocument } = body;

    // Validações
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valor inválido' },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        { error: 'Descrição é obrigatória' },
        { status: 400 }
      );
    }

    // Gerar QR Code PIX
    const qrCode = await generatePixQrCode({
      amount: parseFloat(amount),
      description,
      payerName,
      payerDocument,
    });

    if (!qrCode) {
      return NextResponse.json(
        { error: 'Erro ao gerar QR Code PIX. Verifique as credenciais da API C6 Bank.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        qrCode: qrCode.qrCode,
        qrCodeImage: qrCode.qrCodeImage,
        transactionId: qrCode.transactionId,
        expiresAt: qrCode.expiresAt,
      },
    });
  } catch (error) {
    console.error('Erro ao gerar QR Code PIX:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/pix/generate - Criar nova chave PIX
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const keyType = (searchParams.get('type') as 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'RANDOM') || 'RANDOM';

    const pixKey = await createPixKey(keyType);

    if (!pixKey) {
      return NextResponse.json(
        { error: 'Erro ao criar chave PIX. Verifique as credenciais da API C6 Bank.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: pixKey,
    });
  } catch (error) {
    console.error('Erro ao criar chave PIX:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
