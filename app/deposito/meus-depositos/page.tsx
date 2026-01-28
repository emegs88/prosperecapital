'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Wallet, 
  Filter,
  Columns,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Download
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/calculations';
import { motion } from 'framer-motion';

interface Deposit {
  id: string;
  amount: number;
  method: string;
  status: 'pending' | 'approved' | 'cancelled';
  date: Date;
  updatedAt?: Date;
}

const mockDeposits: Deposit[] = [
  {
    id: '260998',
    amount: 60000,
    method: 'Transferência PIX',
    status: 'pending',
    date: new Date('2026-01-28T19:16:00'),
  },
  {
    id: '260997',
    amount: 50000,
    method: 'TED/DOC',
    status: 'approved',
    date: new Date('2026-01-25T14:30:00'),
    updatedAt: new Date('2026-01-25T15:00:00'),
  },
  {
    id: '260996',
    amount: 30000,
    method: 'Transferência PIX',
    status: 'approved',
    date: new Date('2026-01-20T10:15:00'),
    updatedAt: new Date('2026-01-20T10:20:00'),
  },
];

export default function MeusDepositosPage() {
  const [showFilters, setShowFilters] = useState(false);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-900/30 border-green-800 text-green-400';
      case 'cancelled':
        return 'bg-red-900/30 border-red-800 text-red-400';
      default:
        return 'bg-yellow-900/30 border-yellow-800 text-yellow-400';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprovado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Pendente';
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Meus Depósitos</h1>
        <p className="text-prospere-gray-400">You have a total of deposits.</p>
      </div>
      
      <Card>
        
        {/* Controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline" size="sm">
              <Columns className="w-4 h-4 mr-2" />
              Colunas
            </Button>
            <div className="flex items-center gap-2 px-3 py-2 bg-prospere-gray-800 rounded-lg border border-prospere-gray-700">
              <span className="text-sm text-prospere-gray-400">10</span>
            </div>
          </div>
        </div>
        
        {/* Deposits Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-prospere-gray-800">
                <th className="text-left py-3 px-4 text-xs font-semibold text-prospere-gray-400 uppercase">
                  Detalhes do Depósito
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-prospere-gray-400 uppercase">
                  Valor
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-prospere-gray-400 uppercase">
                  Método
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-prospere-gray-400 uppercase">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-prospere-gray-400 uppercase">
                  Atualizado Em
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-prospere-gray-400 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {mockDeposits.map((deposit) => (
                <motion.tr
                  key={deposit.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-b border-prospere-gray-800 hover:bg-prospere-gray-800/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-white font-medium">{deposit.id}</p>
                      <p className="text-sm text-prospere-gray-400">
                        {formatDate(deposit.date)} {deposit.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <p className="text-white font-bold">{formatCurrency(deposit.amount)}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-prospere-gray-300">{deposit.method}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(deposit.status)}`}>
                      {getStatusIcon(deposit.status)}
                      {getStatusLabel(deposit.status)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-prospere-gray-400 text-sm">
                      {deposit.updatedAt ? formatDate(deposit.updatedAt) : '--'}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      {deposit.status === 'pending' && (
                        <>
                          <button className="p-2 bg-green-900/30 hover:bg-green-900/50 border border-green-800 text-green-400 rounded-lg transition-colors">
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-red-900/30 hover:bg-red-900/50 border border-red-800 text-red-400 rounded-lg transition-colors">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button className="p-2 bg-prospere-gray-700 hover:bg-prospere-gray-600 text-white rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-prospere-gray-700 hover:bg-prospere-gray-600 text-white rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 text-sm text-prospere-gray-400">
          A mostrar {mockDeposits.length} resultados
        </div>
      </Card>
    </div>
  );
}
