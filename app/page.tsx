'use client';

import { MetricCard } from '@/components/ui/Card';
import { Card } from '@/components/ui/Card';
import { 
  DollarSign, 
  TrendingUp, 
  Wallet, 
  Lock, 
  Clock,
  PieChart
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  mockInvestments, 
  mockTransactions, 
  mockWithdrawals,
  generateMonthlyData,
  generatePortfolioEvolution,
  generateInvestmentComparison,
  calculateInvestmentCurrentValue
} from '@/lib/mockData';
import { formatCurrency, formatPercentage } from '@/lib/calculations';
import { useMemo } from 'react';

const COLORS = ['#DC2626', '#D4AF37', '#6B7280', '#374151'];

export default function Dashboard() {
  const monthlyData = useMemo(() => generateMonthlyData(12), []);
  const portfolioEvolution = useMemo(() => generatePortfolioEvolution(12), []);
  const comparisonData = useMemo(() => generateInvestmentComparison(12), []);
  
  // Calculate metrics
  const totalInvested = mockInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalProfit = mockTransactions
    .filter(tx => tx.type === 'base_return' || tx.type === 'performance_return')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  // Calculate current value including retroactive investments with monthly returns
  const totalCurrentValue = mockInvestments.reduce((sum, inv) => {
    return sum + calculateInvestmentCurrentValue(inv);
  }, 0);
  
  const totalInOperation = totalCurrentValue;
  const totalProfitWithReturns = totalInOperation - totalInvested;
  const averageReturn = totalInvested > 0 ? (totalProfitWithReturns / totalInvested) * 100 : 0;
  const monthlyReturn = averageReturn / 12;
  
  const availableBalance = totalInOperation - mockWithdrawals
    .filter(w => w.status === 'pending' || w.status === 'in_liquidation')
    .reduce((sum, w) => sum + w.amount, 0);
  const inWithdrawalBalance = mockWithdrawals
    .filter(w => w.status === 'pending' || w.status === 'in_liquidation')
    .reduce((sum, w) => sum + w.amount, 0);
  const blockedBalance = 0; // Can be calculated based on business logic
  
  // Portfolio distribution data
  const portfolioDistribution = [
    { name: 'Cartas Contempladas', value: 45, color: COLORS[0] },
    { name: 'Cartas Não Contempladas', value: 30, color: COLORS[1] },
    { name: 'Caixa', value: 15, color: COLORS[2] },
    { name: 'Operações Especiais', value: 10, color: COLORS[3] },
  ];
  
  // Projection scenarios (simplified for now)
  const projectionData = portfolioEvolution.map((item, index) => {
    const baseGrowth = 1.032; // 3.2% monthly
    const conservativeGrowth = 1.0224; // 2.24% monthly
    const aggressiveGrowth = 1.048; // 4.8% monthly
    
    return {
      month: item.month,
      atual: item.value,
      conservador: Math.round(item.value * Math.pow(conservativeGrowth, 12 - index)),
      base: Math.round(item.value * Math.pow(baseGrowth, 12 - index)),
      agressivo: Math.round(item.value * Math.pow(aggressiveGrowth, 12 - index)),
    };
  });
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-prospere-gray-400">Visão geral do seu patrimônio</p>
      </div>
      
      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Capital Investido"
          value={formatCurrency(totalInvested)}
          icon={<DollarSign className="w-12 h-12" />}
        />
        <MetricCard
          title="Capital em Operação"
          value={formatCurrency(totalInOperation)}
          icon={<TrendingUp className="w-12 h-12" />}
          trend={{ value: monthlyReturn, isPositive: true }}
        />
        <MetricCard
          title="Lucro Acumulado"
          value={formatCurrency(totalProfitWithReturns)}
          icon={<Wallet className="w-12 h-12" />}
          trend={{ value: averageReturn, isPositive: true }}
        />
        <MetricCard
          title="Rentabilidade Média"
          value={formatPercentage(monthlyReturn)}
          subtitle={`${formatPercentage(averageReturn)} acumulada`}
          icon={<TrendingUp className="w-12 h-12" />}
        />
      </div>
      
      {/* Balance Division */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Saldo Disponível"
          value={formatCurrency(availableBalance)}
          icon={<Wallet className="w-10 h-10" />}
          className="bg-prospere-gray-900"
        />
        <MetricCard
          title="Saldo Bloqueado"
          value={formatCurrency(blockedBalance)}
          icon={<Lock className="w-10 h-10" />}
          className="bg-prospere-gray-900"
        />
        <MetricCard
          title="Em Aviso de Resgate (D+30)"
          value={formatCurrency(inWithdrawalBalance)}
          icon={<Clock className="w-10 h-10" />}
          className="bg-prospere-gray-900"
        />
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Evolution */}
        <Card>
          <h3 className="text-xl font-bold text-white mb-4">Evolução do Patrimônio</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={portfolioEvolution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#DC2626" 
                strokeWidth={3}
                dot={{ fill: '#DC2626', r: 4 }}
                name="Patrimônio"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        
        {/* Monthly Returns */}
        <Card>
          <h3 className="text-xl font-bold text-white mb-4">Rentabilidade Mensal</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" tickFormatter={(value) => `${value.toFixed(1)}%`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                formatter={(value: number) => `${value.toFixed(2)}%`}
              />
              <Legend />
              <Bar dataKey="baseReturn" fill="#D4AF37" name="Renda Base" radius={[4, 4, 0, 0]} />
              <Bar dataKey="performanceReturn" fill="#DC2626" name="Performance BidCon" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        
        {/* Future Projection */}
        <Card>
          <h3 className="text-xl font-bold text-white mb-4">Projeção Futura</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="conservador" 
                stroke="#6B7280" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Conservador"
              />
              <Line 
                type="monotone" 
                dataKey="base" 
                stroke="#DC2626" 
                strokeWidth={3}
                name="Base"
              />
              <Line 
                type="monotone" 
                dataKey="agressivo" 
                stroke="#D4AF37" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Agressivo"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        
        {/* Portfolio Distribution */}
        <Card>
          <h3 className="text-xl font-bold text-white mb-4">Distribuição da Carteira</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={portfolioDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {portfolioDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                formatter={(value: number) => `${value}%`}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </Card>
      </div>
      
      {/* Investment Comparison */}
      <Card className="mt-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-2">Comparação com Outros Investimentos</h3>
          <p className="text-sm text-prospere-gray-400">
            Evolução de R$ 100,00 investidos nos últimos 12 meses
          </p>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis 
              stroke="#9CA3AF" 
              tickFormatter={(value) => `R$ ${value.toFixed(0)}`}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
              formatter={(value: number) => `R$ ${value.toFixed(2)}`}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            <Line 
              type="monotone" 
              dataKey="prospere" 
              stroke="#DC2626" 
              strokeWidth={3}
              dot={{ fill: '#DC2626', r: 4 }}
              name="Prospere Capital"
            />
            <Line 
              type="monotone" 
              dataKey="cdi" 
              stroke="#6B7280" 
              strokeWidth={2}
              dot={{ fill: '#6B7280', r: 3 }}
              name="CDI"
            />
            <Line 
              type="monotone" 
              dataKey="selic" 
              stroke="#9CA3AF" 
              strokeWidth={2}
              dot={{ fill: '#9CA3AF', r: 3 }}
              name="Selic"
            />
            <Line 
              type="monotone" 
              dataKey="tesouroIpca" 
              stroke="#D4AF37" 
              strokeWidth={2}
              dot={{ fill: '#D4AF37', r: 3 }}
              name="Tesouro IPCA+"
            />
            <Line 
              type="monotone" 
              dataKey="poupanca" 
              stroke="#4B5563" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#4B5563', r: 3 }}
              name="Poupança"
            />
            <Line 
              type="monotone" 
              dataKey="ipca" 
              stroke="#374151" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#374151', r: 3 }}
              name="IPCA"
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 pt-4 border-t border-prospere-gray-800">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {((comparisonData[comparisonData.length - 1]?.prospere || 100) - 100).toFixed(1)}%
            </div>
            <div className="text-xs text-prospere-gray-400">Prospere Capital</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-prospere-gray-400 mb-1">
              {((comparisonData[comparisonData.length - 1]?.cdi || 100) - 100).toFixed(1)}%
            </div>
            <div className="text-xs text-prospere-gray-400">CDI</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-prospere-gray-400 mb-1">
              {((comparisonData[comparisonData.length - 1]?.selic || 100) - 100).toFixed(1)}%
            </div>
            <div className="text-xs text-prospere-gray-400">Selic</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-prospere-gray-400 mb-1">
              {((comparisonData[comparisonData.length - 1]?.tesouroIpca || 100) - 100).toFixed(1)}%
            </div>
            <div className="text-xs text-prospere-gray-400">Tesouro IPCA+</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-prospere-gray-400 mb-1">
              {((comparisonData[comparisonData.length - 1]?.poupanca || 100) - 100).toFixed(1)}%
            </div>
            <div className="text-xs text-prospere-gray-400">Poupança</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-prospere-gray-400 mb-1">
              {((comparisonData[comparisonData.length - 1]?.ipca || 100) - 100).toFixed(1)}%
            </div>
            <div className="text-xs text-prospere-gray-400">IPCA</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
