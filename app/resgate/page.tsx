'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { MetricCard } from '@/components/ui/Card';
import { 
  ArrowLeftRight, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  DollarSign
} from 'lucide-react';
import { mockWithdrawals, mockInvestments, mockTransactions } from '@/lib/mockData';
import { formatCurrency, formatDate, addDays } from '@/lib/calculations';
import { Withdrawal } from '@/types';
import { motion } from 'framer-motion';

export default function ResgatePage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(mockWithdrawals);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalType, setWithdrawalType] = useState<'partial' | 'total'>('partial');
  const [showForm, setShowForm] = useState(false);
  
  // Calculate available balance
  const totalInvested = mockInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalProfit = mockTransactions
    .filter(tx => tx.type === 'base_return' || tx.type === 'performance_return')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalBalance = totalInvested + totalProfit;
  const pendingWithdrawals = withdrawals
    .filter(w => w.status === 'pending' || w.status === 'in_liquidation')
    .reduce((sum, w) => sum + w.amount, 0);
  const availableBalance = totalBalance - pendingWithdrawals;
  
  const handleRequestWithdrawal = () => {
    if (!withdrawalAmount || Number(withdrawalAmount) <= 0) return;
    
    const amount = Number(withdrawalAmount);
    if (amount > availableBalance) {
      alert('Valor solicitado excede o saldo disponível');
      return;
    }
    
    const requestedDate = new Date();
    const expectedPaymentDate = addDays(requestedDate, 30);
    
    const newWithdrawal: Withdrawal = {
      id: `wd-${Date.now()}`,
      investorId: '1',
      amount,
      requestedDate,
      expectedPaymentDate,
      status: 'pending',
      type: withdrawalType,
    };
    
    setWithdrawals([...withdrawals, newWithdrawal]);
    setWithdrawalAmount('');
    setShowForm(false);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400';
      case 'in_liquidation':
        return 'text-blue-400';
      case 'paid':
        return 'text-green-400';
      default:
        return 'text-prospere-gray-400';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'in_liquidation':
        return <AlertCircle className="w-5 h-5" />;
      case 'paid':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Em Aviso';
      case 'in_liquidation':
        return 'Em Liquidação';
      case 'paid':
        return 'Pago';
      default:
        return status;
    }
  };
  
  const calculateDaysRemaining = (expectedDate: Date) => {
    const today = new Date();
    const diff = expectedDate.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Resgate</h1>
          <p className="text-prospere-gray-400">Solicite resgates com aviso prévio de 30 dias (D+30)</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : 'Solicitar Resgate'}
        </Button>
      </div>
      
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Saldo Total"
          value={formatCurrency(totalBalance)}
          icon={<DollarSign className="w-10 h-10" />}
        />
        <MetricCard
          title="Saldo Disponível"
          value={formatCurrency(availableBalance)}
          icon={<ArrowLeftRight className="w-10 h-10" />}
        />
        <MetricCard
          title="Em Aviso de Resgate"
          value={formatCurrency(pendingWithdrawals)}
          icon={<Clock className="w-10 h-10" />}
        />
      </div>
      
      {/* Withdrawal Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Card>
            <h2 className="text-xl font-bold text-white mb-4">Nova Solicitação de Resgate</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-prospere-gray-300 mb-2">
                  Tipo de Resgate
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setWithdrawalType('partial')}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                      withdrawalType === 'partial'
                        ? 'bg-prospere-red text-white'
                        : 'bg-prospere-gray-800 text-prospere-gray-400 hover:bg-prospere-gray-700'
                    }`}
                  >
                    Parcial
                  </button>
                  <button
                    onClick={() => setWithdrawalType('total')}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                      withdrawalType === 'total'
                        ? 'bg-prospere-red text-white'
                        : 'bg-prospere-gray-800 text-prospere-gray-400 hover:bg-prospere-gray-700'
                    }`}
                  >
                    Total
                  </button>
                </div>
              </div>
              
              {withdrawalType === 'partial' && (
                <Input
                  label="Valor do Resgate"
                  type="number"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  placeholder="0,00"
                  min={0}
                  max={availableBalance}
                />
              )}
              
              {withdrawalType === 'total' && (
                <div className="p-4 bg-prospere-gray-800 rounded-lg">
                  <p className="text-sm text-prospere-gray-400 mb-1">Valor Total Disponível</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(availableBalance)}</p>
                </div>
              )}
              
              <div className="p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-400 mb-1">Regra D+30</p>
                    <p className="text-xs text-prospere-gray-400">
                      O resgate será processado em 30 dias corridos a partir da data da solicitação.
                      A data prevista de pagamento será {formatDate(addDays(new Date(), 30))}.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={handleRequestWithdrawal}
                  className="flex-1"
                  disabled={withdrawalType === 'partial' && (!withdrawalAmount || Number(withdrawalAmount) <= 0)}
                >
                  Confirmar Solicitação
                </Button>
                <Button 
                  onClick={() => setShowForm(false)}
                  variant="outline"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
      
      {/* Active Withdrawals */}
      <Card>
        <h2 className="text-xl font-bold text-white mb-4">Solicitações de Resgate</h2>
        
        {withdrawals.length === 0 ? (
          <div className="text-center py-12">
            <ArrowLeftRight className="w-12 h-12 text-prospere-gray-600 mx-auto mb-4" />
            <p className="text-prospere-gray-400">Nenhuma solicitação de resgate encontrada</p>
          </div>
        ) : (
          <div className="space-y-4">
            {withdrawals.map((withdrawal) => {
              const daysRemaining = calculateDaysRemaining(withdrawal.expectedPaymentDate);
              const progress = ((30 - daysRemaining) / 30) * 100;
              
              return (
                <motion.div
                  key={withdrawal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-6 bg-prospere-gray-800 rounded-lg border border-prospere-gray-700"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(withdrawal.status)}
                        <span className={`font-semibold ${getStatusColor(withdrawal.status)}`}>
                          {getStatusLabel(withdrawal.status)}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-white mb-1">
                        {formatCurrency(withdrawal.amount)}
                      </p>
                      <p className="text-sm text-prospere-gray-400">
                        {withdrawal.type === 'partial' ? 'Resgate Parcial' : 'Resgate Total'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-prospere-gray-400 mb-1">Solicitado em</p>
                      <p className="text-sm font-medium text-white">
                        {formatDate(withdrawal.requestedDate)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Timeline */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-prospere-gray-400" />
                        <span className="text-sm text-prospere-gray-400">Data Prevista de Pagamento</span>
                      </div>
                      <span className="text-sm font-medium text-white">
                        {formatDate(withdrawal.expectedPaymentDate)}
                      </span>
                    </div>
                    
                    {withdrawal.status === 'pending' && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-prospere-gray-400 mb-1">
                          <span>Progresso do Aviso</span>
                          <span>{daysRemaining} dias restantes</span>
                        </div>
                        <div className="w-full bg-prospere-gray-700 rounded-full h-2">
                          <div
                            className="bg-prospere-red h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Timeline Steps */}
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-prospere-gray-700">
                    <div className={`flex-1 ${withdrawal.status !== 'pending' ? 'opacity-50' : ''}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${
                          withdrawal.status === 'pending' ? 'bg-prospere-red' : 'bg-prospere-gray-600'
                        }`} />
                        <span className="text-xs text-prospere-gray-400">Solicitação Recebida</span>
                      </div>
                      <p className="text-xs text-prospere-gray-500 ml-4">
                        {formatDate(withdrawal.requestedDate)}
                      </p>
                    </div>
                    
                    <div className={`flex-1 ${withdrawal.status === 'paid' ? '' : 'opacity-50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${
                          withdrawal.status === 'paid' ? 'bg-green-400' : 'bg-prospere-gray-600'
                        }`} />
                        <span className="text-xs text-prospere-gray-400">Pagamento Realizado</span>
                      </div>
                      {withdrawal.status === 'paid' && (
                        <p className="text-xs text-prospere-gray-500 ml-4">
                          {formatDate(withdrawal.expectedPaymentDate)}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
