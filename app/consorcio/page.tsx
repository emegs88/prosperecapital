'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MetricCard } from '@/components/ui/Card';
import { 
  CreditCard, 
  TrendingUp,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/calculations';
import { motion } from 'framer-motion';

interface Consorcio {
  id: string;
  tipo: string;
  grupo: string;
  cota: string;
  valorTotal: number;
  valorParcela: number;
  parcelasPagas: number;
  parcelasTotal: number;
  status: 'ativo' | 'contemplado' | 'quitado';
  contemplacao?: Date;
}

const mockConsorcios: Consorcio[] = [
  {
    id: 'CONS-001',
    tipo: 'Imóvel',
    grupo: '12345',
    cota: '678',
    valorTotal: 300000,
    valorParcela: 1500,
    parcelasPagas: 24,
    parcelasTotal: 200,
    status: 'ativo',
  },
  {
    id: 'CONS-002',
    tipo: 'Veículo',
    grupo: '54321',
    cota: '123',
    valorTotal: 80000,
    valorParcela: 800,
    parcelasPagas: 12,
    parcelasTotal: 100,
    status: 'contemplado',
    contemplacao: new Date('2023-06-15'),
  },
];

export default function ConsorcioPage() {
  const totalInvestido = mockConsorcios.reduce((sum, c) => sum + (c.valorParcela * c.parcelasPagas), 0);
  const totalEmOperacao = mockConsorcios
    .filter(c => c.status === 'ativo' || c.status === 'contemplado')
    .reduce((sum, c) => sum + (c.valorTotal - (c.valorParcela * c.parcelasPagas)), 0);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Meus Consórcios</h1>
        <p className="text-prospere-gray-400">Gerencie seus consórcios lastreados</p>
      </div>
      
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Investido"
          value={formatCurrency(totalInvestido)}
          icon={<DollarSign className="w-10 h-10" />}
        />
        <MetricCard
          title="Em Operação"
          value={formatCurrency(totalEmOperacao)}
          icon={<TrendingUp className="w-10 h-10" />}
        />
        <MetricCard
          title="Consórcios Ativos"
          value={mockConsorcios.filter(c => c.status === 'ativo').length.toString()}
          icon={<CreditCard className="w-10 h-10" />}
        />
      </div>
      
      {/* Consórcios List */}
      <div className="space-y-4">
        {mockConsorcios.map((consorcio, index) => (
          <motion.div
            key={consorcio.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-prospere-red/20 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-prospere-red" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{consorcio.tipo}</h3>
                      <p className="text-sm text-prospere-gray-400">
                        Grupo {consorcio.grupo} - Cota {consorcio.cota}
                      </p>
                    </div>
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      ${consorcio.status === 'contemplado' 
                        ? 'bg-green-900/30 border border-green-800 text-green-400'
                        : consorcio.status === 'quitado'
                        ? 'bg-blue-900/30 border border-blue-800 text-blue-400'
                        : 'bg-yellow-900/30 border border-yellow-800 text-yellow-400'
                      }
                    `}>
                      {consorcio.status === 'contemplado' && 'Contemplado'}
                      {consorcio.status === 'quitado' && 'Quitado'}
                      {consorcio.status === 'ativo' && 'Em Andamento'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-prospere-gray-400 mb-1">Valor Total</p>
                      <p className="text-white font-bold">{formatCurrency(consorcio.valorTotal)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-prospere-gray-400 mb-1">Valor da Parcela</p>
                      <p className="text-white font-bold">{formatCurrency(consorcio.valorParcela)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-prospere-gray-400 mb-1">Parcelas</p>
                      <p className="text-white font-bold">
                        {consorcio.parcelasPagas} / {consorcio.parcelasTotal}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-prospere-gray-400 mb-1">Progresso</p>
                      <div className="w-full bg-prospere-gray-800 rounded-full h-2">
                        <div
                          className="bg-prospere-red h-2 rounded-full"
                          style={{ width: `${(consorcio.parcelasPagas / consorcio.parcelasTotal) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {consorcio.contemplacao && (
                    <div className="mt-3 p-3 bg-green-900/20 border border-green-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <p className="text-sm text-green-400">
                          Contemplado em {formatDate(consorcio.contemplacao)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Detalhes
                  </Button>
                  {consorcio.status === 'ativo' && (
                    <Button size="sm">
                      Financiar Lance
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
