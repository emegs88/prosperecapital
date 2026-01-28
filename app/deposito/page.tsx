'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { 
  ArrowDownCircle, 
  Wallet, 
  CreditCard,
  Building2,
  QrCode,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { formatCurrency } from '@/lib/calculations';
import { companyData } from '@/lib/companyData';
import { motion } from 'framer-motion';
import { PixPaymentCard } from '@/components/pix/PixPaymentCard';

export default function DepositoPage() {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [pixData, setPixData] = useState<{
    qrCode?: string;
    qrCodeImage?: string;
    transactionId?: string;
    expiresAt?: string;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const paymentMethods = [
    { value: 'pix', label: 'Transferência PIX', icon: QrCode },
    { value: 'ted', label: 'TED/DOC', icon: Building2 },
    { value: 'card', label: 'Cartão de Crédito', icon: CreditCard },
  ];

  const handleGeneratePix = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Por favor, informe um valor válido');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/pix/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          description: `Depósito Prospere Capital - ${formatCurrency(parseFloat(amount))}`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPixData(data.data);
      } else {
        alert(data.error || 'Erro ao gerar QR Code PIX. Verifique as configurações da API C6 Bank.');
      }
    } catch (error) {
      console.error('Erro ao gerar PIX:', error);
      alert('Erro ao gerar QR Code PIX. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefreshPix = () => {
    setPixData(null);
    handleGeneratePix();
  };

  const handlePaymentConfirmed = (data: any) => {
    // Pagamento confirmado!
    alert(`Pagamento confirmado! Valor: ${formatCurrency(data.amount || parseFloat(amount))}\n\nSeu depósito será creditado em breve.`);
    
    // Aqui você pode:
    // - Redirecionar para página de confirmação
    // - Atualizar o saldo do usuário
    // - Enviar notificação
    // - Registrar no histórico
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Novo Depósito</h1>
          <p className="text-prospere-gray-400">Realize um depósito em sua conta</p>
        </div>
      </div>
      
      {/* Info Card */}
      <Card>
        <div className="p-4 bg-prospere-gold/10 border border-prospere-gold/30 rounded-lg mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-prospere-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Wallet className="w-5 h-5 text-prospere-gold" />
            </div>
            <div>
              <p className="text-prospere-gold font-semibold mb-1">Depósito Lastreado</p>
              <p className="text-sm text-prospere-gray-300">
                Seus depósitos são lastreados em cartas de consórcio contempladas, garantindo segurança e rentabilidade.
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Deposit Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-4">Informações do Depósito</h3>
            
            <Input
              label="Valor do Depósito"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              min={0}
            />
            
            <div>
              <label className="block text-sm font-medium text-prospere-gray-300 mb-2">
                Método de Pagamento
              </label>
              <div className="space-y-2">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.value}
                      onClick={() => setPaymentMethod(method.value)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-colors
                        ${paymentMethod === method.value
                          ? 'border-prospere-red bg-prospere-red/10 text-white'
                          : 'border-prospere-gray-700 bg-prospere-gray-800 text-prospere-gray-400 hover:border-prospere-gray-600'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{method.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {paymentMethod === 'pix' && (
              <div className="p-4 bg-prospere-gray-800 rounded-lg border border-prospere-gray-700">
                <p className="text-sm text-prospere-gray-400 mb-2">Instruções PIX:</p>
                <ul className="text-sm text-prospere-gray-300 space-y-1 list-disc list-inside">
                  <li>O depósito será processado instantaneamente</li>
                  <li>Use a chave PIX fornecida abaixo</li>
                  <li>Valor mínimo: R$ 100,00</li>
                </ul>
              </div>
            )}
            
            <Button 
              size="lg" 
              className="w-full"
              onClick={paymentMethod === 'pix' ? handleGeneratePix : undefined}
              disabled={isGenerating || !amount || parseFloat(amount) <= 0}
            >
              {isGenerating ? (
                <>
                  <Clock className="w-5 h-5 mr-2 animate-spin" />
                  Gerando QR Code...
                </>
              ) : (
                <>
                  <ArrowDownCircle className="w-5 h-5 mr-2" />
                  {paymentMethod === 'pix' ? 'Gerar QR Code PIX' : 'Confirmar Depósito'}
                </>
              )}
            </Button>
          </div>
          
          {/* Payment Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-4">Dados para Depósito</h3>
            
            <div className="p-6 bg-prospere-gray-800 rounded-lg border border-prospere-gray-700 space-y-4">
              <div>
                <p className="text-xs text-prospere-gray-400 mb-1">Razão Social</p>
                <p className="text-white font-medium">{companyData.razaoSocial}</p>
              </div>
              
              <div>
                <p className="text-xs text-prospere-gray-400 mb-1">CNPJ</p>
                <p className="text-white font-medium">{companyData.cnpj}</p>
              </div>
              
              <div>
                <p className="text-xs text-prospere-gray-400 mb-1">Chave PIX (E-mail)</p>
                <div className="flex items-center gap-2">
                  <p className="text-white font-mono text-sm">{companyData.pix.chave}</p>
                  <button 
                    className="p-1 hover:bg-prospere-gray-700 rounded"
                    onClick={() => navigator.clipboard.writeText(companyData.pix.chave)}
                    title="Copiar chave PIX"
                  >
                    <QrCode className="w-4 h-4 text-prospere-gray-400" />
                  </button>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-prospere-gray-400 mb-1">Banco</p>
                <p className="text-white font-medium">{companyData.banco.nome}</p>
              </div>
              
              <div>
                <p className="text-xs text-prospere-gray-400 mb-1">Agência</p>
                <p className="text-white font-medium">{companyData.banco.agencia}</p>
              </div>
              
              <div>
                <p className="text-xs text-prospere-gray-400 mb-1">Conta</p>
                <p className="text-white font-medium">{companyData.banco.conta}</p>
              </div>
              
              <div>
                <p className="text-xs text-prospere-gray-400 mb-1">Telefone</p>
                <p className="text-white font-medium">{companyData.telefone}</p>
              </div>
              
              <div className="pt-2 border-t border-prospere-gray-700">
                <p className="text-xs text-prospere-gray-400 mb-1">Endereço</p>
                <p className="text-white text-sm">
                  {companyData.endereco.logradouro}, {companyData.endereco.numero} - {companyData.endereco.complemento}
                </p>
                <p className="text-white text-sm">
                  {companyData.endereco.bairro} - {companyData.endereco.cidade}/{companyData.endereco.uf}
                </p>
                <p className="text-white text-sm">CEP: {companyData.endereco.cep}</p>
              </div>
              
              <div className="pt-4 border-t border-prospere-gray-700">
                <p className="text-xs text-prospere-gray-400 mb-2">Valor a depositar</p>
                <p className="text-2xl font-bold text-prospere-gold">
                  {amount ? formatCurrency(Number(amount)) : 'R$ 0,00'}
                </p>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-400 font-medium mb-1">⚠️ Importante</p>
              <p className="text-xs text-prospere-gray-400">
                Envie o comprovante após realizar o depósito para agilizar o processamento.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* PIX Payment Card */}
      {pixData && paymentMethod === 'pix' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <PixPaymentCard
            amount={parseFloat(amount)}
            description={`Depósito Prospere Capital`}
            transactionId={pixData.transactionId}
            qrCode={pixData.qrCode}
            qrCodeImage={pixData.qrCodeImage}
            expiresAt={pixData.expiresAt}
            onRefresh={handleRefreshPix}
            onPaymentConfirmed={handlePaymentConfirmed}
          />
        </motion.div>
      )}
    </div>
  );
}
