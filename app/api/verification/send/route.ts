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
    // Em produção, aqui você enviaria o código:
    // - Por email: usando serviço como SendGrid, AWS SES, Resend, etc.
    // - Por WhatsApp: usando API como Twilio, WhatsApp Business API, etc.
    
    console.log(`\n📧 ============================================`);
    console.log(`📧 Código de Verificação ${type === 'email' ? 'Email' : 'WhatsApp'}`);
    console.log(`📧 ============================================`);
    console.log(`${type === 'email' ? `📧 Email: ${email}` : `📱 WhatsApp: ${phone}`}`);
    console.log(`🔐 Código: ${code}`);
    console.log(`⏰ Válido por: 10 minutos`);
    console.log(`📧 ============================================\n`);

    // Simular delay de envio
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Em produção, salvaria o código no banco de dados com expiração (ex: 10 minutos)
    // Por enquanto, retornamos o código apenas em desenvolvimento para facilitar testes
    const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV !== 'production';

    return NextResponse.json({
      success: true,
      message: `Código enviado ${type === 'email' ? 'por email' : 'por WhatsApp'}`,
      // Apenas em desenvolvimento retornamos o código (para facilitar testes)
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
