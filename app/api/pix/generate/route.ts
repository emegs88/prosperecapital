import { NextRequest, NextResponse } from 'next/server';
import { generatePixQrCode } from '@/lib/c6bank';

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
    const qrCode = await generatePixQrCode(
      parseFloat(amount),
      description,
      payerName,
      payerDocument
    );

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
        transactionId: qrCode.txid,
        location: qrCode.location,
        expiresAt: qrCode.expiresAt,
        // Para gerar imagem do QR Code, usar biblioteca como qrcode
        // qrCodeImage: await generateQRCodeImage(qrCode.qrCode),
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

