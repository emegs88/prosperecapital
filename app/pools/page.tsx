'use client';

import { Card } from '@/components/ui/Card';
import { MetricCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Briefcase, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  FileText
} from 'lucide-react';
import { mockPools } from '@/lib/mockData';
import { formatCurrency, formatPercentage } from '@/lib/calculations';
import { Pool } from '@/types';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

export default function PoolsPage() {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'high':
        return 'text-red-400';
      default:
        return 'text-prospere-gray-400';
    }
  };
  
  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'Baixo';
      case 'medium':
        return 'Médio';
      case 'high':
        return 'Alto';
      default:
        return risk;
    }
  };
  
  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-900/30 border-green-800 text-green-400';
      case 'medium':
        return 'bg-yellow-900/30 border-yellow-800 text-yellow-400';
      case 'high':
        return 'bg-red-900/30 border-red-800 text-red-400';
      default:
        return 'bg-prospere-gray-800 border-prospere-gray-700 text-prospere-gray-400';
    }
  };
  
  // Performance comparison data
  const performanceData = mockPools.map(pool => ({
    name: pool.name.replace('Pool ', ''),
    meta: pool.targetReturn,
    resultado: pool.results,
  }));
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Pools / Operações</h1>
        <p className="text-prospere-gray-400">Visão geral dos pools de investimento disponíveis</p>
      </div>
      
      {/* Pools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {mockPools.map((pool, index) => (
          <motion.div
            key={pool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-5 h-5 text-prospere-red" />
                    <h3 className="text-xl font-bold text-white">{pool.name}</h3>
                  </div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium ${getRiskBadgeColor(pool.risk)}`}>
                    <AlertTriangle className="w-3 h-3" />
                    Risco {getRiskLabel(pool.risk)}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-prospere-gray-400 mb-1">Meta de Rentabilidade</p>
                    <p className="text-lg font-bold text-white">
                      {formatPercentage(pool.targetReturn)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-prospere-gray-400 mb-1">Resultado</p>
                    <p className={`text-lg font-bold ${
                      pool.results >= pool.targetReturn ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {formatPercentage(pool.results)}
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-prospere-gray-800">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-prospere-gray-400">Prazo Médio</span>
                      <span className="text-white font-medium">{pool.averageTerm} meses</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-prospere-gray-400">Volume Alocado</span>
                      <span className="text-white font-medium">
                        {formatCurrency(pool.allocatedVolume)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-prospere-gray-800">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Relatórios
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <FileText className="w-4 h-4 mr-2" />
                      Detalhes
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Performance Comparison Chart */}
      <Card>
        <h2 className="text-xl font-bold text-white mb-4">Comparativo de Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" tickFormatter={(value) => `${value.toFixed(1)}%`} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151', 
                borderRadius: '8px' 
              }}
              formatter={(value: number) => `${value.toFixed(2)}%`}
            />
            <Legend />
            <Bar dataKey="meta" fill="#6B7280" name="Meta" radius={[4, 4, 0, 0]} />
            <Bar dataKey="resultado" fill="#DC2626" name="Resultado" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      
      {/* Pool Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {mockPools.map((pool) => (
          <Card key={pool.id}>
            <h3 className="text-lg font-bold text-white mb-4">{pool.name}</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-prospere-gray-400 mb-2">Estratégia</p>
                <p className="text-sm text-white">
                  {pool.type === 'base' && 'Foco em renda base estável com baixa volatilidade.'}
                  {pool.type === 'performance' && 'Foco em performance através de operações especiais e BidCon.'}
                  {pool.type === 'mixed' && 'Estratégia balanceada combinando renda base e performance.'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-prospere-gray-400 mb-2">Composição</p>
                <div className="space-y-2">
                  {pool.type === 'base' && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-prospere-gray-400">Cartas Contempladas</span>
                        <span className="text-white">70%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-prospere-gray-400">Cartas Não Contempladas</span>
                        <span className="text-white">20%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-prospere-gray-400">Caixa</span>
                        <span className="text-white">10%</span>
                      </div>
                    </>
                  )}
                  {pool.type === 'performance' && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-prospere-gray-400">Operações BidCon</span>
                        <span className="text-white">60%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-prospere-gray-400">Operações Especiais</span>
                        <span className="text-white">30%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-prospere-gray-400">Caixa</span>
                        <span className="text-white">10%</span>
                      </div>
                    </>
                  )}
                  {pool.type === 'mixed' && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-prospere-gray-400">Renda Base</span>
                        <span className="text-white">50%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-prospere-gray-400">Performance</span>
                        <span className="text-white">40%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-prospere-gray-400">Caixa</span>
                        <span className="text-white">10%</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="pt-4 border-t border-prospere-gray-800">
                <div className="flex items-center gap-2">
                  {pool.results >= pool.targetReturn ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  )}
                  <span className="text-sm text-prospere-gray-400">
                    {pool.results >= pool.targetReturn 
                      ? 'Meta atingida' 
                      : 'Meta em andamento'}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
