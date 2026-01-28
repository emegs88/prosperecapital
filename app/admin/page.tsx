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
  Search,
  Calendar,
  Percent
} from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/calculations';
import { 
  mockInvestors, 
  mockInvestments, 
  mockTransactions,
  mockPools,
  mockMonthlyReturns,
  calculateInvestmentCurrentValue,
  getInvestmentEvolution
} from '@/lib/mockData';
import { mockUsers, createUser, User } from '@/lib/auth';
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
  const [activeTab, setActiveTab] = useState<'overview' | 'investors' | 'investments' | 'cards' | 'sales' | 'dre' | 'users' | 'returns'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showCreateInvestment, setShowCreateInvestment] = useState(false);
  const [showAddReturn, setShowAddReturn] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'investor' as 'admin' | 'investor',
  });
  const [newInvestment, setNewInvestment] = useState({
    investorId: '1',
    amount: '',
    type: 'single' as 'single' | 'recurring',
    pool: 'mixed' as 'base' | 'performance' | 'mixed',
    date: new Date().toISOString().split('T')[0],
  });
  const [newReturn, setNewReturn] = useState({
    investmentId: '',
    month: '',
    returnPercentage: '',
  });
  
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
          { id: 'returns', label: 'Rentabilidades' },
          { id: 'cards', label: 'Cartas' },
          { id: 'sales', label: 'Vendas BidCon' },
          { id: 'dre', label: 'DRE' },
          { id: 'users', label: 'Usuários' },
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
            <Button onClick={() => setShowCreateInvestment(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Aporte Retroativo
            </Button>
          </div>
          
          {showCreateInvestment && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-6 bg-prospere-gray-800 rounded-lg border border-prospere-gray-700"
            >
              <h3 className="text-lg font-bold text-white mb-4">Criar Aporte Retroativo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Investidor"
                  value={newInvestment.investorId}
                  onChange={(e) => setNewInvestment({ ...newInvestment, investorId: e.target.value })}
                  options={mockInvestors.map(inv => ({ value: inv.id, label: inv.name }))}
                />
                <Input
                  label="Valor do Aporte"
                  type="number"
                  value={newInvestment.amount}
                  onChange={(e) => setNewInvestment({ ...newInvestment, amount: e.target.value })}
                  placeholder="20000"
                />
                <Select
                  label="Tipo"
                  value={newInvestment.type}
                  onChange={(e) => setNewInvestment({ ...newInvestment, type: e.target.value as 'single' | 'recurring' })}
                  options={[
                    { value: 'single', label: 'Aporte Único' },
                    { value: 'recurring', label: 'Aporte Recorrente' },
                  ]}
                />
                <Select
                  label="Pool"
                  value={newInvestment.pool}
                  onChange={(e) => setNewInvestment({ ...newInvestment, pool: e.target.value as 'base' | 'performance' | 'mixed' })}
                  options={[
                    { value: 'base', label: 'Renda Base' },
                    { value: 'performance', label: 'Performance' },
                    { value: 'mixed', label: 'Misto' },
                  ]}
                />
                <Input
                  label="Data do Aporte"
                  type="date"
                  value={newInvestment.date}
                  onChange={(e) => setNewInvestment({ ...newInvestment, date: e.target.value })}
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => {
                    if (newInvestment.amount && newInvestment.investorId) {
                      alert(`Aporte retroativo de ${formatCurrency(parseFloat(newInvestment.amount))} criado com sucesso!\n\nAgora você pode adicionar rentabilidades mensais na aba "Rentabilidades".`);
                      setNewInvestment({ investorId: '1', amount: '', type: 'single', pool: 'mixed', date: new Date().toISOString().split('T')[0] });
                      setShowCreateInvestment(false);
                    } else {
                      alert('Preencha todos os campos');
                    }
                  }}
                >
                  Criar Aporte
                </Button>
                <Button variant="outline" onClick={() => setShowCreateInvestment(false)}>
                  Cancelar
                </Button>
              </div>
            </motion.div>
          )}
          
          <div className="space-y-2">
            {mockInvestments.map((investment) => {
              const currentValue = calculateInvestmentCurrentValue(investment);
              const evolution = getInvestmentEvolution(investment);
              const totalReturn = ((currentValue - investment.amount) / investment.amount) * 100;
              
              return (
                <div
                  key={investment.id}
                  className="p-4 bg-prospere-gray-800 rounded-lg border border-prospere-gray-700"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-semibold text-white">Aporte #{investment.id}</p>
                      <p className="text-sm text-prospere-gray-400">
                        {investment.type === 'single' ? 'Aporte Único' : 'Aporte Recorrente'} - {investment.pool}
                      </p>
                      <p className="text-xs text-prospere-gray-500 mt-1">
                        {investment.date.toLocaleDateString('pt-BR')}
                      </p>
                      {investment.monthlyReturns && investment.monthlyReturns.length > 0 && (
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {investment.monthlyReturns.map((ret) => (
                            <span
                              key={ret.id}
                              className="px-2 py-1 bg-prospere-red/20 border border-prospere-red text-prospere-red text-xs rounded"
                            >
                              {ret.month}: {ret.returnPercentage.toFixed(1)}%
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-xs text-prospere-gray-400">Valor Inicial</p>
                      <p className="text-sm font-medium text-prospere-gray-300">
                        {formatCurrency(investment.amount)}
                      </p>
                      <p className="text-xs text-prospere-gray-400 mt-2">Valor Atual</p>
                      <p className="text-lg font-bold text-white">
                        {formatCurrency(currentValue)}
                      </p>
                      <p className={`text-xs mt-1 ${totalReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
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
              );
            })}
          </div>
        </Card>
      )}
      
      {/* Returns Tab */}
      {activeTab === 'returns' && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Rentabilidades Mensais por Cliente</h2>
            <div className="flex gap-2">
              <Select
                value={selectedInvestment || ''}
                onChange={(e) => {
                  setSelectedInvestment(e.target.value);
                  setShowAddReturn(false);
                }}
                options={[
                  { value: '', label: 'Selecione um investimento...' },
                  ...mockInvestments.map(inv => ({
                    value: inv.id,
                    label: `${mockInvestors.find(i => i.id === inv.investorId)?.name || 'Cliente'} - ${formatCurrency(inv.amount)} - ${inv.date.toLocaleDateString('pt-BR')}`
                  }))
                ]}
                className="w-80"
              />
              {selectedInvestment && (
                <Button onClick={() => setShowAddReturn(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Mês
                </Button>
              )}
            </div>
          </div>
          
          {selectedInvestment && (() => {
            const investment = mockInvestments.find(inv => inv.id === selectedInvestment);
            if (!investment) return null;
            
            const investor = mockInvestors.find(inv => inv.id === investment.investorId);
            const investmentDate = new Date(investment.date);
            const today = new Date();
            
            // Generate list of months from investment date to today
            const months: string[] = [];
            let currentDate = new Date(investmentDate.getFullYear(), investmentDate.getMonth(), 1);
            const endDate = new Date(today.getFullYear(), today.getMonth(), 1);
            
            while (currentDate <= endDate) {
              const year = currentDate.getFullYear();
              const month = String(currentDate.getMonth() + 1).padStart(2, '0');
              months.push(`${year}-${month}`);
              currentDate.setMonth(currentDate.getMonth() + 1);
            }
            
            return (
              <div className="space-y-4">
                <div className="p-4 bg-prospere-gray-800 rounded-lg border border-prospere-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-lg font-bold text-white">
                        {investor?.name || 'Cliente'} - Aporte #{investment.id}
                      </p>
                      <p className="text-sm text-prospere-gray-400">
                        Valor Inicial: {formatCurrency(investment.amount)} | 
                        Data: {investment.date.toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-prospere-gray-400">Valor Atual</p>
                      <p className="text-2xl font-bold text-white">
                        {formatCurrency(calculateInvestmentCurrentValue(investment))}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {months.map((month) => {
                      const existingReturn = investment.monthlyReturns?.find(r => r.month === month);
                      const [year, monthNum] = month.split('-');
                      const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
                      
                      return (
                        <div
                          key={month}
                          className={`p-3 rounded-lg border ${
                            existingReturn
                              ? 'bg-green-900/20 border-green-800'
                              : 'bg-prospere-gray-900 border-prospere-gray-700'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-white capitalize">
                              {monthName}
                            </span>
                            {existingReturn && (
                              <span className="px-2 py-1 bg-green-900/30 border border-green-800 text-green-400 text-xs rounded">
                                {existingReturn.returnPercentage.toFixed(1)}%
                              </span>
                            )}
                          </div>
                          {existingReturn ? (
                            <div className="space-y-2">
                              <Input
                                type="number"
                                step="0.1"
                                value={existingReturn.returnPercentage}
                                onChange={(e) => {
                                  const newValue = parseFloat(e.target.value) || 0;
                                  // In production, this would update the return in the database
                                  console.log(`Atualizar rentabilidade de ${month} para ${newValue}%`);
                                  // For now, show preview
                                  if (investment) {
                                    const currentValue = calculateInvestmentCurrentValue(investment);
                                    const updatedValue = currentValue * (1 + newValue / 100);
                                    // You could update state here to show preview
                                  }
                                }}
                                className="text-sm bg-prospere-gray-800"
                                placeholder="0.0"
                              />
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    const input = document.querySelector(`input[value="${existingReturn.returnPercentage}"]`) as HTMLInputElement;
                                    if (input) {
                                      const newValue = parseFloat(input.value) || 0;
                                      alert(`Rentabilidade de ${monthName} atualizada para ${newValue.toFixed(1)}%!\n\nEm produção, isso salvaria no banco de dados.`);
                                    }
                                  }}
                                  className="flex-1 text-xs"
                                >
                                  Salvar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    if (confirm(`Remover rentabilidade de ${monthName}?`)) {
                                      alert(`Rentabilidade removida!\n\nEm produção, isso removeria do banco de dados.`);
                                    }
                                  }}
                                  className="text-xs px-2"
                                >
                                  ×
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Input
                                type="number"
                                step="0.1"
                                placeholder="Ex: 15.0"
                                className="text-sm bg-prospere-gray-800"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    const input = e.target as HTMLInputElement;
                                    const value = parseFloat(input.value);
                                    if (!isNaN(value) && value > 0) {
                                      setNewReturn({
                                        investmentId: selectedInvestment,
                                        month: month,
                                        returnPercentage: value.toString(),
                                      });
                                      setShowAddReturn(true);
                                    }
                                  }
                                }}
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const input = document.querySelector(`input[placeholder="Ex: 15.0"]`) as HTMLInputElement;
                                  if (input && input.value) {
                                    setNewReturn({
                                      investmentId: selectedInvestment,
                                      month: month,
                                      returnPercentage: input.value,
                                    });
                                    setShowAddReturn(true);
                                  } else {
                                    // Direct add with prompt
                                    const value = prompt(`Digite a rentabilidade para ${monthName} (%):`);
                                    if (value && !isNaN(parseFloat(value))) {
                                      setNewReturn({
                                        investmentId: selectedInvestment,
                                        month: month,
                                        returnPercentage: value,
                                      });
                                      setShowAddReturn(true);
                                    }
                                  }
                                }}
                                className="w-full text-xs"
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Adicionar
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}
          
          {showAddReturn && selectedInvestment && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-6 bg-prospere-gray-800 rounded-lg border border-prospere-gray-700"
            >
              <h3 className="text-lg font-bold text-white mb-4">Adicionar Rentabilidade Mensal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-prospere-gray-300 mb-2">
                    Mês/Ano
                  </label>
                  <Input
                    type="text"
                    value={newReturn.month}
                    onChange={(e) => setNewReturn({ ...newReturn, month: e.target.value })}
                    placeholder="2024-11"
                    disabled
                  />
                  <p className="text-xs text-prospere-gray-400 mt-1">
                    {newReturn.month && (() => {
                      const [year, month] = newReturn.month.split('-');
                      return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
                    })()}
                  </p>
                </div>
                <Input
                  label="Rentabilidade (%)"
                  type="number"
                  step="0.1"
                  value={newReturn.returnPercentage}
                  onChange={(e) => setNewReturn({ ...newReturn, returnPercentage: e.target.value })}
                  placeholder="15.0"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => {
                    if (newReturn.month && newReturn.returnPercentage) {
                      const investment = mockInvestments.find(inv => inv.id === newReturn.investmentId);
                      if (investment) {
                        const currentValue = calculateInvestmentCurrentValue(investment);
                        const newValue = currentValue * (1 + parseFloat(newReturn.returnPercentage) / 100);
                        const [year, month] = newReturn.month.split('-');
                        const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
                        
                        alert(
                          `Rentabilidade de ${newReturn.returnPercentage}% adicionada para ${monthName}!\n\n` +
                          `Valor antes: ${formatCurrency(currentValue)}\n` +
                          `Valor após: ${formatCurrency(newValue)}\n` +
                          `Ganho: ${formatCurrency(newValue - currentValue)}`
                        );
                        setNewReturn({ investmentId: selectedInvestment, month: '', returnPercentage: '' });
                        setShowAddReturn(false);
                      }
                    } else {
                      alert('Preencha a rentabilidade');
                    }
                  }}
                >
                  Adicionar Rentabilidade
                </Button>
                <Button variant="outline" onClick={() => {
                  setNewReturn({ investmentId: selectedInvestment, month: '', returnPercentage: '' });
                  setShowAddReturn(false);
                }}>
                  Cancelar
                </Button>
              </div>
            </motion.div>
          )}
          
          <div className="space-y-4">
            {mockInvestments
              .filter(inv => inv.monthlyReturns && inv.monthlyReturns.length > 0)
              .map((investment) => {
                const evolution = getInvestmentEvolution(investment);
                const currentValue = calculateInvestmentCurrentValue(investment);
                
                return (
                  <div
                    key={investment.id}
                    className="p-6 bg-prospere-gray-800 rounded-lg border border-prospere-gray-700"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-semibold text-white text-lg">Aporte #{investment.id}</p>
                        <p className="text-sm text-prospere-gray-400">
                          Investidor: {mockInvestors.find(inv => inv.id === investment.investorId)?.name || 'N/A'}
                        </p>
                        <p className="text-xs text-prospere-gray-500 mt-1">
                          Data: {investment.date.toLocaleDateString('pt-BR')} | 
                          Valor Inicial: {formatCurrency(investment.amount)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-prospere-gray-400">Valor Atual</p>
                        <p className="text-2xl font-bold text-white">
                          {formatCurrency(currentValue)}
                        </p>
                        <p className="text-sm text-green-400 mt-1">
                          +{formatCurrency(currentValue - investment.amount)} (
                          +{(((currentValue - investment.amount) / investment.amount) * 100).toFixed(2)}%)
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-white mb-3">Evolução Mensal</h4>
                      <div className="space-y-2">
                        {evolution.map((evol, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center p-3 bg-prospere-gray-900 rounded border border-prospere-gray-700"
                          >
                            <div className="flex items-center gap-3">
                              <Calendar className="w-4 h-4 text-prospere-gray-400" />
                              <span className="text-sm text-white font-medium">{evol.month}</span>
                              {evol.returnPercentage > 0 && (
                                <span className="px-2 py-1 bg-green-900/30 border border-green-800 text-green-400 text-xs rounded flex items-center gap-1">
                                  <Percent className="w-3 h-3" />
                                  {evol.returnPercentage.toFixed(1)}%
                                </span>
                              )}
                            </div>
                            <span className="text-sm font-bold text-white">
                              {formatCurrency(evol.value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {evolution.length > 1 && (
                      <div className="mt-4">
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={evolution}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                            <YAxis stroke="#9CA3AF" tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                              formatter={(value: number) => formatCurrency(value)}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#DC2626" 
                              strokeWidth={3}
                              dot={{ fill: '#DC2626', r: 4 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                );
              })}
            
            {mockInvestments.filter(inv => !inv.monthlyReturns || inv.monthlyReturns.length === 0).length > 0 && (
              <div className="p-4 bg-prospere-gray-800 rounded-lg border border-prospere-gray-700">
                <p className="text-sm text-prospere-gray-400 mb-2">
                  Investimentos sem rentabilidades definidas:
                </p>
                <div className="space-y-2">
                  {mockInvestments
                    .filter(inv => !inv.monthlyReturns || inv.monthlyReturns.length === 0)
                    .map((investment) => (
                      <div
                        key={investment.id}
                        className="p-3 bg-prospere-gray-900 rounded border border-prospere-gray-700 flex justify-between items-center"
                      >
                        <div>
                          <p className="text-sm font-medium text-white">Aporte #{investment.id}</p>
                          <p className="text-xs text-prospere-gray-400">
                            {formatCurrency(investment.amount)} - {investment.date.toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setNewReturn({ investmentId: investment.id, month: '', returnPercentage: '' });
                            setShowAddReturn(true);
                          }}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Adicionar Rentabilidade
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            )}
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
      
      {/* Users Tab */}
      {activeTab === 'users' && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Usuários do Sistema</h2>
            <Button onClick={() => setShowCreateUser(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Novo Usuário
            </Button>
          </div>
          
          {showCreateUser && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-6 bg-prospere-gray-800 rounded-lg border border-prospere-gray-700"
            >
              <h3 className="text-lg font-bold text-white mb-4">Criar Novo Usuário</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nome Completo"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Nome do usuário"
                />
                <Input
                  label="E-mail"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="email@exemplo.com"
                />
                <Input
                  label="Senha"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Senha de acesso"
                />
                <Select
                  label="Tipo de Usuário"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'investor' })}
                  options={[
                    { value: 'investor', label: 'Investidor' },
                    { value: 'admin', label: 'Administrador' },
                  ]}
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => {
                    if (newUser.name && newUser.email && newUser.password) {
                      createUser(newUser);
                      alert('Usuário criado com sucesso!');
                      setNewUser({ name: '', email: '', password: '', role: 'investor' });
                      setShowCreateUser(false);
                    } else {
                      alert('Preencha todos os campos');
                    }
                  }}
                >
                  Criar Usuário
                </Button>
                <Button variant="outline" onClick={() => setShowCreateUser(false)}>
                  Cancelar
                </Button>
              </div>
            </motion.div>
          )}
          
          <div className="space-y-2">
            {mockUsers.map((user) => (
              <div
                key={user.id}
                className="p-4 bg-prospere-gray-800 rounded-lg border border-prospere-gray-700"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-white">{user.name}</p>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-prospere-red/20 border border-prospere-red text-prospere-red'
                          : 'bg-blue-900/30 border border-blue-800 text-blue-400'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'Investidor'}
                      </span>
                    </div>
                    <p className="text-sm text-prospere-gray-400">{user.email}</p>
                    <p className="text-xs text-prospere-gray-500 mt-1">
                      Criado em: {user.createdAt.toLocaleDateString('pt-BR')}
                      {user.lastLogin && ` | Último acesso: ${user.lastLogin.toLocaleDateString('pt-BR')}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      Resetar Senha
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
