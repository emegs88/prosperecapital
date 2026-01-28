'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { QrCode, Copy, CheckCircle2, Clock, RefreshCw, AlertCircle, XCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/calculations';
import { companyData } from '@/lib/companyData';
import Image from 'next/image';

interface PixPaymentCardProps {
  amount: number;
  description?: string;
  transactionId?: string;
  qrCode?: string;
  qrCodeImage?: string;
  expiresAt?: string;
  onRefresh?: () => void;
  onPaymentConfirmed?: (data: any) => void;
}

type PaymentStatus = 'pending' | 'paid' | 'expired' | 'cancelled';

export function PixPaymentCard({
  amount,
  description = 'Depósito Prospere Capital',
  transactionId,
  qrCode,
  qrCodeImage,
  expiresAt,
  onRefresh,
  onPaymentConfirmed,
}: PixPaymentCardProps) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [isChecking, setIsChecking] = useState(false);
  const [checkInterval, setCheckInterval] = useState<NodeJS.Timeout | null>(null);

  // Verificar status do pagamento periodicamente
  useEffect(() => {
    if (transactionId && paymentStatus === 'pending') {
      const checkPaymentStatus = async () => {
        if (isChecking) return;
        
        setIsChecking(true);
        try {
          const response = await fetch(`/api/pix/check?transactionId=${transactionId}`);
          const data = await response.json();
          
          if (data.success && data.data) {
            const status = data.data.status;
            setPaymentStatus(status);
            
            if (status === 'paid') {
              // Pagamento confirmado!
              if (onPaymentConfirmed) {
                onPaymentConfirmed(data.data);
              }
              // Parar de verificar
              if (checkInterval) {
                clearInterval(checkInterval);
              }
            } else if (status === 'expired' || status === 'cancelled') {
              // Parar de verificar
              if (checkInterval) {
                clearInterval(checkInterval);
              }
            }
          }
        } catch (error) {
          console.error('Erro ao verificar pagamento:', error);
        } finally {
          setIsChecking(false);
        }
      };

      // Verificar imediatamente
      checkPaymentStatus();
      
      // Verificar a cada 5 segundos
      const interval = setInterval(checkPaymentStatus, 5000);
      setCheckInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [transactionId, paymentStatus, isChecking, checkInterval, onPaymentConfirmed]);

  // Timer de expiração
  useEffect(() => {
    if (expiresAt && paymentStatus === 'pending') {
      const updateTimeLeft = () => {
        const now = new Date();
        const expiry = new Date(expiresAt);
        const diff = expiry.getTime() - now.getTime();

        if (diff <= 0) {
          setTimeLeft('Expirado');
          setPaymentStatus('expired');
          if (checkInterval) {
            clearInterval(checkInterval);
          }
          return;
        }

        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      };

      updateTimeLeft();
      const interval = setInterval(updateTimeLeft, 1000);
      return () => clearInterval(interval);
    }
  }, [expiresAt, paymentStatus, checkInterval]);

  const handleCopyCode = () => {
    if (qrCode) {
      navigator.clipboard.writeText(qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {companyData.razaoSocial}
          </h2>
          <p className="text-gray-600">gerou uma cobrança para você</p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-6">
          {qrCodeImage ? (
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <Image
                src={qrCodeImage}
                alt="QR Code PIX"
                width={200}
                height={200}
                className="w-48 h-48"
              />
            </div>
          ) : (
            <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-200">
              <QrCode className="w-24 h-24 text-gray-400" />
            </div>
          )}
        </div>

        {/* Payment Status Banner */}
        {paymentStatus === 'paid' && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-500 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">Pagamento Confirmado!</p>
                <p className="text-sm text-green-700">Seu depósito foi processado com sucesso.</p>
              </div>
            </div>
          </div>
        )}

        {paymentStatus === 'expired' && (
          <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-500 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
              <div>
                <p className="font-semibold text-yellow-900">QR Code Expirado</p>
                <p className="text-sm text-yellow-700">Gere um novo QR Code para continuar.</p>
              </div>
            </div>
          </div>
        )}

        {paymentStatus === 'cancelled' && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-lg">
            <div className="flex items-center gap-3">
              <XCircle className="w-6 h-6 text-red-600" />
              <div>
                <p className="font-semibold text-red-900">Pagamento Cancelado</p>
                <p className="text-sm text-red-700">Esta cobrança foi cancelada.</p>
              </div>
            </div>
          </div>
        )}

        {/* Charge Details */}
        <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
          <div>
            <p className="text-sm text-gray-600 mb-1">Valor da cobrança</p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(amount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Realizada em</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatDate(new Date())}
            </p>
            {expiresAt && paymentStatus === 'pending' && (
              <>
                <p className="text-sm text-gray-600 mb-1 mt-3">Expira em</p>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <p className="text-lg font-semibold text-gray-900">
                    {timeLeft || 'Calculando...'}
                  </p>
                </div>
              </>
            )}
            {paymentStatus === 'pending' && isChecking && (
              <div className="flex items-center gap-2 mt-3">
                <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                <p className="text-sm text-blue-600">Verificando pagamento...</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Instruções de pagamento:
          </h3>
          <ol className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="font-semibold text-prospere-red">1.</span>
              <span>Abra o aplicativo do seu banco</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-semibold text-prospere-red">2.</span>
              <span>Selecione a opção de pagamento</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-semibold text-prospere-red">3.</span>
              <span>Leia o QR Code ou copie e cole o código enviado</span>
            </li>
          </ol>
        </div>

        {/* PIX Code */}
        {qrCode && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 mb-1">Código PIX (Copiar e Colar)</p>
                <p className="text-sm font-mono text-gray-900 break-all">
                  {qrCode}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyCode}
                className="flex-shrink-0"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Transaction Info */}
        {transactionId && (
          <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Cobrança gerada com sucesso
                </p>
                <p className="text-xs text-blue-700">
                  ID: {transactionId}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {onRefresh && (
            <Button
              variant="outline"
              onClick={onRefresh}
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Gerar Novo QR Code
            </Button>
          )}
          <Button
            onClick={() => window.print()}
            variant="outline"
            className="flex-1"
          >
            Imprimir
          </Button>
        </div>

        {/* Company Info */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            {companyData.razaoSocial} - CNPJ: {companyData.cnpj}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {companyData.endereco.logradouro}, {companyData.endereco.numero} - {companyData.endereco.cidade}/{companyData.endereco.uf}
          </p>
        </div>
      </div>
    </Card>
  );
}
