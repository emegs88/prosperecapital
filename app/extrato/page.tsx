'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { 
  FileText, 
  Download, 
  Filter,
  ArrowDownCircle,
  ArrowUpCircle,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { mockTransactions, mockInvestments } from '@/lib/mockData';
import { formatCurrency, formatDate } from '@/lib/calculations';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import { Transaction } from '@/types';
import { motion } from 'framer-motion';

export default function ExtratoPage() {
  const currentUser = getCurrentUser();
  const userIsAdmin = isAdmin();
  const userId = currentUser?.id || '1';
  
  const [filterType, setFilterType] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredTransactions = useMemo(() => {
    // Filtrar transações baseado no role
    let filtered = userIsAdmin 
      ? [...mockTransactions]
      : mockTransactions.filter(tx => tx.investorId === userId);
    
    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(tx => tx.type === filterType);
    }
    
    // Filter by date range
    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter(tx => tx.date >= start);
    }
    
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(tx => tx.date <= end);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(tx => 
        tx.description.toLowerCase().includes(term) ||
        tx.id.toLowerCase().includes(term)
      );
    }
    
    // Sort by date (newest first)
    return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [filterType, startDate, endDate, searchTerm, userIsAdmin, userId]);
  
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownCircle className="w-5 h-5 text-green-400" />;
      case 'withdrawal':
        return <ArrowUpCircle className="w-5 h-5 text-red-400" />;
      case 'base_return':
      case 'performance_return':
        return <TrendingUp className="w-5 h-5 text-yellow-400" />;
      case 'reinvestment':
        return <RefreshCw className="w-5 h-5 text-blue-400" />;
      default:
        return <FileText className="w-5 h-5 text-prospere-gray-400" />;
    }
  };
  
  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'text-green-400';
      case 'withdrawal':
        return 'text-red-400';
      case 'base_return':
      case 'performance_return':
        return 'text-yellow-400';
      case 'reinvestment':
        return 'text-blue-400';
      default:
        return 'text-white';
    }
  };
  
  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Aporte';
      case 'withdrawal':
        return 'Resgate';
      case 'base_return':
        return 'Rendimento Base';
      case 'performance_return':
        return 'Rendimento Performance';
      case 'reinvestment':
        return 'Reinvestimento';
      default:
        return type;
    }
  };
  
  const handleExportPDF = () => {
    // Placeholder for PDF export
    alert('Funcionalidade de exportação PDF será implementada em breve');
  };
  
  const handleExportCSV = () => {
    // Generate CSV
    const headers = ['Data', 'Tipo', 'Descrição', 'Valor'];
    const rows = filteredTransactions.map(tx => [
      formatDate(tx.date),
      getTransactionLabel(tx.type),
      tx.description,
      tx.amount.toFixed(2),
    ]);
    
    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `extrato_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Calculate totals
  const totals = useMemo(() => {
    const deposits = filteredTransactions
      .filter(tx => tx.type === 'deposit')
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    const withdrawals = filteredTransactions
      .filter(tx => tx.type === 'withdrawal')
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    const returns = filteredTransactions
      .filter(tx => tx.type === 'base_return' || tx.type === 'performance_return')
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    return { deposits, withdrawals, returns };
  }, [filteredTransactions]);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Extrato</h1>
          <p className="text-prospere-gray-400">Histórico completo de transações</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportPDF} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
          <Button onClick={handleExportCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-prospere-red" />
          <h2 className="text-lg font-bold text-white">Filtros</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            label="Tipo de Transação"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            options={[
              { value: 'all', label: 'Todas' },
              { value: 'deposit', label: 'Aportes' },
              { value: 'base_return', label: 'Rendimentos Base' },
              { value: 'performance_return', label: 'Rendimentos Performance' },
              { value: 'reinvestment', label: 'Reinvestimentos' },
              { value: 'withdrawal', label: 'Resgates' },
            ]}
          />
          
          <Input
            label="Data Inicial"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          
          <Input
            label="Data Final"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          
          <Input
            label="Buscar"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Descrição ou ID..."
          />
        </div>
        
        {/* Totals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-prospere-gray-800">
          <div className="p-4 bg-prospere-gray-800 rounded-lg">
            <p className="text-sm text-prospere-gray-400 mb-1">Total de Aportes</p>
            <p className="text-xl font-bold text-green-400">
              {formatCurrency(totals.deposits)}
            </p>
          </div>
          <div className="p-4 bg-prospere-gray-800 rounded-lg">
            <p className="text-sm text-prospere-gray-400 mb-1">Total de Rendimentos</p>
            <p className="text-xl font-bold text-yellow-400">
              {formatCurrency(totals.returns)}
            </p>
          </div>
          <div className="p-4 bg-prospere-gray-800 rounded-lg">
            <p className="text-sm text-prospere-gray-400 mb-1">Total de Resgates</p>
            <p className="text-xl font-bold text-red-400">
              {formatCurrency(totals.withdrawals)}
            </p>
          </div>
        </div>
      </Card>
      
      {/* Transactions List */}
      <Card>
        <h2 className="text-xl font-bold text-white mb-4">
          Transações ({filteredTransactions.length})
        </h2>
        
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-prospere-gray-600 mx-auto mb-4" />
            <p className="text-prospere-gray-400">Nenhuma transação encontrada</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-prospere-gray-800 rounded-lg border border-prospere-gray-700 hover:border-prospere-gray-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-shrink-0">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-semibold ${getTransactionColor(transaction.type)}`}>
                          {getTransactionLabel(transaction.type)}
                        </span>
                        <span className="text-xs text-prospere-gray-500">
                          {transaction.id}
                        </span>
                      </div>
                      <p className="text-sm text-prospere-gray-400 truncate">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-prospere-gray-500 mt-1">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className={`text-lg font-bold ${getTransactionColor(transaction.type)}`}>
                      {transaction.type === 'withdrawal' ? '-' : '+'}
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
