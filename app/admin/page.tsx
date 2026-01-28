'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { MetricCard } from '@/components/ui/Card';
import { 
  Users, 
  DollarSign, 
  FileText, 
  TrendingUp,
  Package,
  ShoppingCart,
  BarChart3,
  Download,
  Plus,
  Search
} from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/calculations';
import { 
  mockInvestors, 
  mockInvestments, 
  mockTransactions,
  mockPools 
} from '@/lib/mockData';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Extended mock data for admin
const mockInvestorsExtended = mockInvestors.map((inv, idx) => ({
  ...inv,
  totalInvested: [100000, 75000, 50000][idx] || 0,
  status: 'active' as const,
}));

const mockCards = [
  { id: '1', type: 'contemplated', value: 50000, status: 'active' },
  { id: '2', type: 'non_contemplated', value: 30000, status: 'active' },
  { id: '3', type: 'contemplated', value: 45000, status: 'sold' },
];

const mockBidConSales = [
  { month: 'Jan', value: 120000 },
  { month: 'Fev', value: 150000 },
  { month: 'Mar', value: 180000 },
  { month: 'Abr', value: 200000 },
  { month: 'Mai', value: 220000 },
  { month: 'Jun', value: 250000 },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'investors' | 'investments' | 'cards' | 'sales' | 'dre'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Calculate admin metrics
  const totalInvestors = mockInvestorsExtended.length;
  const totalInvested = mockInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalTransactions = mockTransactions.length;
  const totalCards = mockCards.length;
  const totalBidConSales = mockBidConSales.reduce((sum, sale) => sum + sale.value, 0);
  
  // DRE data
  const dreData = {
    revenue: {
      baseReturns: 50000,
      performanceReturns: 75000,
      bidConSales: totalBidConSales,
      total: 50000 + 75000 + totalBidConSales,
    },
    expenses: {
      operations: 30000,
      management: 20000,
      total: 50000,
    },
    profit: (50000 + 75000 + totalBidConSales) - 50000,
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Painel Administrativo</h1>
        <p className="text-prospere-gray-400">Controle e gestão da Prospere Capital</p>
      </div>
      
      {/* Tabs */}
      <div className="flex gap-2 border-b border-prospere-gray-800">
        {[
          { id: 'overview', label: 'Visão Geral' },
          { id: 'investors', label: 'Investidores' },
          { id: 'investments', label: 'Aportes' },
          { id: 'cards', label: 'Cartas' },
          { id: 'sales', label: 'Vendas BidCon' },
          { id: 'dre', label: 'DRE' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-prospere-red text-white'
                : 'border-transparent text-prospere-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total de Investidores"
              value={totalInvestors.toString()}
              icon={<Users className="w-10 h-10" />}
            />
            <MetricCard
              title="Capital Total Investido"
              value={formatCurrency(totalInvested)}
              icon={<DollarSign className="w-10 h-10" />}
            />
            <MetricCard
              title="Total de Transações"
              value={totalTransactions.toString()}
              icon={<FileText className="w-10 h-10" />}
            />
            <MetricCard
              title="Cartas em Estoque"
              value={totalCards.toString()}
              icon={<Package className="w-10 h-10" />}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-xl font-bold text-white mb-4">Evolução de Aportes</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockInvestments.map((inv, idx) => ({
                  month: `M${idx + 1}`,
                  value: inv.amount,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Line type="monotone" dataKey="value" stroke="#DC2626" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
            
            <Card>
              <h3 className="text-xl font-bold text-white mb-4">Distribuição por Pool</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockPools.map(pool => ({
                  name: pool.name.replace('Pool ', ''),
                  volume: pool.allocatedVolume,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Bar dataKey="volume" fill="#DC2626" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </>
      )}
      
      {/* Investors Tab */}
      {activeTab === 'investors' && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Investidores</h2>
            <div className="flex gap-2">
              <Input
                placeholder="Buscar investidor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Investidor
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            {mockInvestorsExtended
              .filter(inv => 
                inv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inv.email.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((investor) => (
                <div
                  key={investor.id}
                  className="p-4 bg-prospere-gray-800 rounded-lg border border-prospere-gray-700"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-white">{investor.name}</p>
                      <p className="text-sm text-prospere-gray-400">{investor.email}</p>
                      <p className="text-xs text-prospere-gray-500 mt-1">CPF: {investor.cpf}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-prospere-gray-400">Total Investido</p>
                      <p className="text-lg font-bold text-white">
                        {formatCurrency(investor.totalInvested)}
                      </p>
                      <span className="inline-block mt-1 px-2 py-1 bg-green-900/30 border border-green-800 text-green-400 text-xs rounded">
                        {investor.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}
      
      {/* Investments Tab */}
      {activeTab === 'investments' && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Aportes</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Aporte
            </Button>
          </div>
          
          <div className="space-y-2">
            {mockInvestments.map((investment) => (
              <div
                key={investment.id}
                className="p-4 bg-prospere-gray-800 rounded-lg border border-prospere-gray-700"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-white">Aporte #{investment.id}</p>
                    <p className="text-sm text-prospere-gray-400">
                      {investment.type === 'single' ? 'Aporte Único' : 'Aporte Recorrente'} - {investment.pool}
                    </p>
                    <p className="text-xs text-prospere-gray-500 mt-1">
                      {investment.date.toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">
                      {formatCurrency(investment.amount)}
                    </p>
                    <span className={`inline-block mt-1 px-2 py-1 border text-xs rounded ${
                      investment.status === 'active'
                        ? 'bg-green-900/30 border-green-800 text-green-400'
                        : 'bg-gray-900/30 border-gray-800 text-gray-400'
                    }`}>
                      {investment.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
      
      {/* Cards Tab */}
      {activeTab === 'cards' && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Estoque de Cartas</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Cartas
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-prospere-gray-800 rounded-lg">
              <p className="text-sm text-prospere-gray-400 mb-1">Cartas Contempladas</p>
              <p className="text-2xl font-bold text-white">
                {mockCards.filter(c => c.type === 'contemplated').length}
              </p>
            </div>
            <div className="p-4 bg-prospere-gray-800 rounded-lg">
              <p className="text-sm text-prospere-gray-400 mb-1">Cartas Não Contempladas</p>
              <p className="text-2xl font-bold text-white">
                {mockCards.filter(c => c.type === 'non_contemplated').length}
              </p>
            </div>
            <div className="p-4 bg-prospere-gray-800 rounded-lg">
              <p className="text-sm text-prospere-gray-400 mb-1">Total em Estoque</p>
              <p className="text-2xl font-bold text-white">{mockCards.length}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            {mockCards.map((card) => (
              <div
                key={card.id}
                className="p-4 bg-prospere-gray-800 rounded-lg border border-prospere-gray-700"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-white">Carta #{card.id}</p>
                    <p className="text-sm text-prospere-gray-400">
                      {card.type === 'contemplated' ? 'Contemplada' : 'Não Contemplada'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">
                      {formatCurrency(card.value)}
                    </p>
                    <span className={`inline-block mt-1 px-2 py-1 border text-xs rounded ${
                      card.status === 'active'
                        ? 'bg-green-900/30 border-green-800 text-green-400'
                        : 'bg-gray-900/30 border-gray-800 text-gray-400'
                    }`}>
                      {card.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
      
      {/* Sales Tab */}
      {activeTab === 'sales' && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Vendas BidCon</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Venda
            </Button>
          </div>
          
          <div className="mb-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockBidConSales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Bar dataKey="value" fill="#DC2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="p-4 bg-prospere-gray-800 rounded-lg">
            <p className="text-sm text-prospere-gray-400 mb-1">Total de Vendas</p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(totalBidConSales)}
            </p>
          </div>
        </Card>
      )}
      
      {/* DRE Tab */}
      {activeTab === 'dre' && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Demonstração de Resultados (DRE)</h2>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar Relatório
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="p-6 bg-prospere-gray-800 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-4">Receitas</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-prospere-gray-400">Rendimentos Renda Base</span>
                  <span className="text-white font-medium">
                    {formatCurrency(dreData.revenue.baseReturns)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-prospere-gray-400">Rendimentos Performance</span>
                  <span className="text-white font-medium">
                    {formatCurrency(dreData.revenue.performanceReturns)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-prospere-gray-400">Vendas BidCon</span>
                  <span className="text-white font-medium">
                    {formatCurrency(dreData.revenue.bidConSales)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-prospere-gray-700">
                  <span className="text-white font-bold">Total de Receitas</span>
                  <span className="text-white font-bold text-lg">
                    {formatCurrency(dreData.revenue.total)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-prospere-gray-800 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-4">Despesas</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-prospere-gray-400">Operacionais</span>
                  <span className="text-white font-medium">
                    {formatCurrency(dreData.expenses.operations)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-prospere-gray-400">Gestão</span>
                  <span className="text-white font-medium">
                    {formatCurrency(dreData.expenses.management)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-prospere-gray-700">
                  <span className="text-white font-bold">Total de Despesas</span>
                  <span className="text-white font-bold text-lg">
                    {formatCurrency(dreData.expenses.total)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-prospere-red/10 border-2 border-prospere-red rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-white font-bold text-xl">Lucro Líquido</span>
                <span className="text-white font-bold text-2xl">
                  {formatCurrency(dreData.profit)}
                </span>
              </div>
              <p className="text-sm text-prospere-gray-400 mt-2">
                Margem: {formatPercentage((dreData.profit / dreData.revenue.total) * 100)}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
