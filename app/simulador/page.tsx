'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Slider } from '@/components/ui/Slider';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  generateProjectionScenarios,
  calculateTotalProfit,
  calculateAverageReturn,
  formatCurrency,
  formatPercentage
} from '@/lib/calculations';
import { MetricCard } from '@/components/ui/Card';
import { Calculator, TrendingUp } from 'lucide-react';

export default function SimuladorPage() {
  const [amount, setAmount] = useState(50000);
  const [type, setType] = useState<'single' | 'recurring'>('single');
  const [months, setMonths] = useState(12);
  const [pool, setPool] = useState<'base' | 'performance' | 'mixed'>('mixed');
  const [reinvest, setReinvest] = useState(true);
  const [monthlyDeposit, setMonthlyDeposit] = useState(5000);
  
  // Calculate projections
  const monthlyDepositValue = type === 'recurring' ? monthlyDeposit : 0;
  const scenarios = generateProjectionScenarios(amount, months, monthlyDepositValue, reinvest);
  
  // Base scenario for main display
  const baseProjection = scenarios.base;
  const finalValue = baseProjection[baseProjection.length - 1];
  const totalDeposits = amount + (monthlyDepositValue * months);
  const totalProfit = calculateTotalProfit(finalValue, amount, monthlyDepositValue * months);
  const averageReturn = calculateAverageReturn(finalValue, amount, monthlyDepositValue * months, months);
  
  // Prepare chart data
  const chartData = baseProjection.map((value, index) => ({
    month: `M${index}`,
    value: value,
  }));
  
  // Pool rates
  const poolRates = {
    base: 0.022, // 2.2%
    performance: 0.045, // 4.5%
    mixed: 0.032, // 3.2%
  };
  
  const currentRate = poolRates[pool];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Simulador de Aporte</h1>
        <p className="text-prospere-gray-400">Simule seus investimentos e projeções futuras</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inputs Section */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-prospere-red" />
              <h2 className="text-xl font-bold text-white">Parâmetros</h2>
            </div>
            
            <div className="space-y-4">
              <Slider
                label="Valor Inicial"
                value={amount}
                onChange={setAmount}
                min={1000}
                max={1000000}
                step={1000}
                formatValue={(val) => formatCurrency(val)}
              />
              
              <div>
                <label className="block text-sm font-medium text-prospere-gray-300 mb-2">
                  Tipo de Aporte
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setType('single')}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                      type === 'single'
                        ? 'bg-prospere-red text-white'
                        : 'bg-prospere-gray-800 text-prospere-gray-400 hover:bg-prospere-gray-700'
                    }`}
                  >
                    Único
                  </button>
                  <button
                    onClick={() => setType('recurring')}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                      type === 'recurring'
                        ? 'bg-prospere-red text-white'
                        : 'bg-prospere-gray-800 text-prospere-gray-400 hover:bg-prospere-gray-700'
                    }`}
                  >
                    Recorrente
                  </button>
                </div>
              </div>
              
              {type === 'recurring' && (
                <Slider
                  label="Aporte Mensal"
                  value={monthlyDeposit}
                  onChange={setMonthlyDeposit}
                  min={500}
                  max={50000}
                  step={500}
                  formatValue={(val) => formatCurrency(val)}
                />
              )}
              
              <Select
                label="Prazo"
                value={months.toString()}
                onChange={(e) => setMonths(Number(e.target.value))}
                options={[
                  { value: '3', label: '3 meses' },
                  { value: '6', label: '6 meses' },
                  { value: '12', label: '12 meses' },
                  { value: '24', label: '24 meses' },
                  { value: '36', label: '36 meses' },
                ]}
              />
              
              <Select
                label="Pool"
                value={pool}
                onChange={(e) => setPool(e.target.value as any)}
                options={[
                  { value: 'base', label: 'Renda Base' },
                  { value: 'performance', label: 'Performance' },
                  { value: 'mixed', label: 'Misto' },
                ]}
              />
              
              <div>
                <label className="block text-sm font-medium text-prospere-gray-300 mb-2">
                  Reinvestir Rendimentos
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setReinvest(true)}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                      reinvest
                        ? 'bg-prospere-red text-white'
                        : 'bg-prospere-gray-800 text-prospere-gray-400 hover:bg-prospere-gray-700'
                    }`}
                  >
                    Sim
                  </button>
                  <button
                    onClick={() => setReinvest(false)}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                      !reinvest
                        ? 'bg-prospere-red text-white'
                        : 'bg-prospere-gray-800 text-prospere-gray-400 hover:bg-prospere-gray-700'
                    }`}
                  >
                    Não
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Results Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Results Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Patrimônio Final Projetado"
              value={formatCurrency(finalValue)}
              icon={<TrendingUp className="w-10 h-10" />}
            />
            <MetricCard
              title="Lucro Total Projetado"
              value={formatCurrency(totalProfit)}
              icon={<Calculator className="w-10 h-10" />}
            />
            <MetricCard
              title="Rentabilidade Média Projetada"
              value={formatPercentage(averageReturn)}
              subtitle={`Taxa: ${formatPercentage(currentRate * 100)} a.m.`}
              icon={<TrendingUp className="w-10 h-10" />}
            />
          </div>
          
          {/* Projection Chart */}
          <Card>
            <h3 className="text-xl font-bold text-white mb-4">Projeção Mês a Mês</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9CA3AF"
                  interval={Math.floor(chartData.length / 12)}
                />
                <YAxis 
                  stroke="#9CA3AF" 
                  tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151', 
                    borderRadius: '8px' 
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#DC2626" 
                  strokeWidth={3}
                  dot={{ fill: '#DC2626', r: 4 }}
                  name="Patrimônio Projetado"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          
          {/* Scenarios Comparison */}
          <Card>
            <h3 className="text-xl font-bold text-white mb-4">Cenários de Projeção</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={scenarios.base.map((_, index) => ({
                month: `M${index}`,
                conservador: scenarios.conservative[index],
                base: scenarios.base[index],
                agressivo: scenarios.aggressive[index],
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9CA3AF"
                  interval={Math.floor(scenarios.base.length / 12)}
                />
                <YAxis 
                  stroke="#9CA3AF" 
                  tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151', 
                    borderRadius: '8px' 
                  }}
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
          
          {/* Action Button */}
          <div className="flex gap-4">
            <Button size="lg" className="flex-1">
              Reservar Vaga / Iniciar Aporte
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
