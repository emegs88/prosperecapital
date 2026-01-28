'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { 
  ArrowUpCircle, 
  Wallet, 
  Building2,
  QrCode,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '@/lib/calculations';
import { companyData } from '@/lib/companyData';
import { mockInvestments, mockTransactions } from '@/lib/mockData';

export default function SaquePage() {
  const [amount, setAmount] = useState('');
  const [accountType, setAccountType] = useState('same');
  
  // Calculate available balance
  const totalInvested = mockInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalProfit = mockTransactions
    .filter(tx => tx.type === 'base_return' || tx.type === 'performance_return')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const availableBalance = totalInvested + totalProfit;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Solicitar Saque</h1>
          <p className="text-prospere-gray-400">Realize um saque da sua conta</p>
        </div>
      </div>
      
      {/* Balance Card */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-prospere-gray-400 mb-1">Saldo Disponível</p>
            <p className="text-3xl font-bold text-white">{formatCurrency(availableBalance)}</p>
          </div>
          <Wallet className="w-12 h-12 text-prospere-gray-600" />
        </div>
      </Card>
      
      {/* Info Card */}
      <Card>
        <div className="p-4 bg-prospere-gold/10 border border-prospere-gold/30 rounded-lg mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-prospere-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Wallet className="w-5 h-5 text-prospere-gold" />
            </div>
            <div>
              <p className="text-prospere-gold font-semibold mb-1">Saque Lastreado</p>
              <p className="text-sm text-prospere-gray-300">
                Seus saques são garantidos por cartas de consórcio contempladas em nosso portfólio.
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Withdrawal Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-4">Informações do Saque</h3>
            
            <Input
              label="Valor do Saque"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              min={0}
              max={availableBalance}
            />
            
            <div className="p-4 bg-prospere-gray-800 rounded-lg">
              <p className="text-sm text-prospere-gray-400 mb-2">Valor disponível</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(availableBalance)}</p>
            </div>
            
            <Select
              label="Conta de Destino"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              options={[
                { value: 'same', label: 'Mesma conta de depósito' },
                { value: 'pix', label: 'Chave PIX' },
                { value: 'bank', label: 'Conta bancária' },
              ]}
            />
            
            {accountType === 'pix' && (
              <Input
                label="Chave PIX"
                type="text"
                placeholder="Digite a chave PIX"
              />
            )}
            
            {accountType === 'bank' && (
              <div className="space-y-4">
                <Input
                  label="Banco"
                  type="text"
                  placeholder="Nome do banco"
                />
                <Input
                  label="Agência"
                  type="text"
                  placeholder="0000"
                />
                <Input
                  label="Conta"
                  type="text"
                  placeholder="00000-0"
                />
              </div>
            )}
            
            <div className="p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-400 font-medium mb-1">Regra D+30</p>
                  <p className="text-xs text-prospere-gray-400">
                    O saque será processado em 30 dias corridos a partir da data da solicitação.
                  </p>
                </div>
              </div>
            </div>
            
            <Button size="lg" className="w-full">
              <ArrowUpCircle className="w-5 h-5 mr-2" />
              Confirmar Saque
            </Button>
          </div>
          
          {/* Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-4">Resumo do Saque</h3>
            
            <div className="p-6 bg-prospere-gray-800 rounded-lg border border-prospere-gray-700 space-y-4">
              <div className="flex justify-between">
                <span className="text-prospere-gray-400">Valor do saque</span>
                <span className="text-white font-bold">
                  {amount ? formatCurrency(Number(amount)) : 'R$ 0,00'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-prospere-gray-400">Taxa de saque</span>
                <span className="text-white">R$ 0,00</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-prospere-gray-400">Valor líquido</span>
                <span className="text-white font-bold">
                  {amount ? formatCurrency(Number(amount)) : 'R$ 0,00'}
                </span>
              </div>
              
              <div className="pt-4 border-t border-prospere-gray-700">
                <p className="text-sm text-prospere-gray-400 mb-2">Data prevista de pagamento</p>
                <p className="text-lg font-bold text-prospere-gold">
                  {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            
            <div className="p-4 bg-prospere-gray-800 rounded-lg border border-prospere-gray-700">
              <p className="text-sm text-prospere-gray-400 mb-2">Método de saque</p>
              <div className="flex items-center gap-2">
                {accountType === 'pix' && <QrCode className="w-5 h-5 text-prospere-gray-400" />}
                {accountType === 'bank' && <Building2 className="w-5 h-5 text-prospere-gray-400" />}
                <span className="text-white">
                  {accountType === 'same' && 'Mesma conta de depósito'}
                  {accountType === 'pix' && 'Chave PIX'}
                  {accountType === 'bank' && 'Conta bancária'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
