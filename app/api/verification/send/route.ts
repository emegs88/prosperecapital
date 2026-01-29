import { NextRequest, NextResponse } from 'next/server';

/**
 * API para enviar código de verificação por email ou WhatsApp
 * POST /api/verification/send
 */
export async function POST(request: NextRequest) {
  try {
    const { email, phone, type } = await request.json();

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Email ou telefone é obrigatório' },
        { status: 400 }
      );
    }

    // Gerar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Em produção, aqui você enviaria o código:
    // - Por email: usando serviço como SendGrid, AWS SES, etc.
    // - Por WhatsApp: usando API como Twilio, WhatsApp Business API, etc.
    
    // Por enquanto, simulamos o envio
    console.log(`📧 Código de verificação ${type === 'email' ? 'por email' : 'por WhatsApp'}:`);
    console.log(`${type === 'email' ? `Email: ${email}` : `WhatsApp: ${phone}`}`);
    console.log(`Código: ${code}`);

    // Simular delay de envio
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Em produção, salvaria o código no banco de dados com expiração (ex: 10 minutos)
    // Por enquanto, retornamos o código (em produção, NÃO retornar o código)
    // Apenas para desenvolvimento/teste, retornamos o código
    const isDevelopment = process.env.NODE_ENV === 'development';

    return NextResponse.json({
      success: true,
      message: `Código enviado ${type === 'email' ? 'por email' : 'por WhatsApp'}`,
      // Apenas em desenvolvimento retornamos o código
      ...(isDevelopment && { code }),
      expiresIn: 600, // 10 minutos
    });
  } catch (error) {
    console.error('Erro ao enviar código:', error);
    return NextResponse.json(
      { error: 'Erro ao enviar código de verificação' },
      { status: 500 }
    );
  }
}
