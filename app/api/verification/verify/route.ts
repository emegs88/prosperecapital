import { NextRequest, NextResponse } from 'next/server';

/**
 * API para verificar código de verificação
 * POST /api/verification/verify
 */
export async function POST(request: NextRequest) {
  try {
    const { email, phone, code, type } = await request.json();

    if (!code || code.length !== 6) {
      return NextResponse.json(
        { error: 'Código inválido' },
        { status: 400 }
      );
    }

    // Em produção, aqui você:
    // 1. Buscaria o código no banco de dados
    // 2. Verificaria se não expirou
    // 3. Verificaria se corresponde ao email/telefone
    // 4. Invalidaria o código após uso

    // Por enquanto, simulamos a verificação
    // Em desenvolvimento, aceita qualquer código de 6 dígitos
    // Em produção, validaria contra o código salvo no banco

    const isValid = /^\d{6}$/.test(code);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Código inválido. Use apenas números.' },
        { status: 400 }
      );
    }

    // Simular delay de verificação
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      verified: true,
      message: `${type === 'email' ? 'Email' : 'WhatsApp'} verificado com sucesso`,
    });
  } catch (error) {
    console.error('Erro ao verificar código:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar código' },
      { status: 500 }
    );
  }
}
