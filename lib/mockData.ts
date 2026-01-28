import { 
  Investor, 
  Investment, 
  Transaction, 
  Withdrawal, 
  Pool,
  MonthlyData 
} from '@/types';

// Mock Investor
export const mockInvestor: Investor = {
  id: '1',
  name: 'João Silva',
  email: 'joao@example.com',
  cpf: '123.456.789-00',
  createdAt: new Date('2023-01-15'),
};

// Mock Investors (for admin)
export const mockInvestors: Investor[] = [
  mockInvestor,
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@example.com',
    cpf: '987.654.321-00',
    createdAt: new Date('2023-02-20'),
  },
  {
    id: '3',
    name: 'Pedro Oliveira',
    email: 'pedro@example.com',
    cpf: '111.222.333-44',
    createdAt: new Date('2023-03-15'),
  },
];

// Mock Investments
export const mockInvestments: Investment[] = [
  {
    id: 'inv-1',
    investorId: '1',
    amount: 50000,
    type: 'single',
    pool: 'mixed',
    date: new Date('2023-01-15'),
    status: 'active',
  },
  {
    id: 'inv-2',
    investorId: '1',
    amount: 30000,
    type: 'recurring',
    pool: 'base',
    date: new Date('2023-03-01'),
    status: 'active',
  },
  {
    id: 'inv-3',
    investorId: '1',
    amount: 20000,
    type: 'single',
    pool: 'performance',
    date: new Date('2023-06-10'),
    status: 'active',
  },
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: 'tx-1',
    investorId: '1',
    type: 'deposit',
    amount: 50000,
    date: new Date('2023-01-15'),
    description: 'Aporte inicial',
    relatedInvestmentId: 'inv-1',
  },
  {
    id: 'tx-2',
    investorId: '1',
    type: 'base_return',
    amount: 1200,
    date: new Date('2023-02-15'),
    description: 'Rendimento Renda Base - Jan/2023',
    relatedInvestmentId: 'inv-1',
  },
  {
    id: 'tx-3',
    investorId: '1',
    type: 'performance_return',
    amount: 2500,
    date: new Date('2023-02-20'),
    description: 'Rendimento Performance - Jan/2023',
    relatedInvestmentId: 'inv-1',
  },
  {
    id: 'tx-4',
    investorId: '1',
    type: 'deposit',
    amount: 30000,
    date: new Date('2023-03-01'),
    description: 'Aporte recorrente',
    relatedInvestmentId: 'inv-2',
  },
  {
    id: 'tx-5',
    investorId: '1',
    type: 'reinvestment',
    amount: 3700,
    date: new Date('2023-03-15'),
    description: 'Reinvestimento de rendimentos',
  },
  {
    id: 'tx-6',
    investorId: '1',
    type: 'base_return',
    amount: 2000,
    date: new Date('2023-03-15'),
    description: 'Rendimento Renda Base - Fev/2023',
  },
  {
    id: 'tx-7',
    investorId: '1',
    type: 'performance_return',
    amount: 3200,
    date: new Date('2023-03-20'),
    description: 'Rendimento Performance - Fev/2023',
  },
  {
    id: 'tx-8',
    investorId: '1',
    type: 'deposit',
    amount: 20000,
    date: new Date('2023-06-10'),
    description: 'Aporte único',
    relatedInvestmentId: 'inv-3',
  },
  {
    id: 'tx-9',
    investorId: '1',
    type: 'base_return',
    amount: 2400,
    date: new Date('2023-07-15'),
    description: 'Rendimento Renda Base - Jun/2023',
  },
  {
    id: 'tx-10',
    investorId: '1',
    type: 'performance_return',
    amount: 4500,
    date: new Date('2023-07-20'),
    description: 'Rendimento Performance - Jun/2023',
  },
];

// Mock Withdrawals
export const mockWithdrawals: Withdrawal[] = [
  {
    id: 'wd-1',
    investorId: '1',
    amount: 15000,
    requestedDate: new Date('2023-11-01'),
    expectedPaymentDate: new Date('2023-12-01'),
    status: 'pending',
    type: 'partial',
  },
];

// Mock Pools
export const mockPools: Pool[] = [
  {
    id: 'pool-1',
    name: 'Pool Renda Base',
    type: 'base',
    targetReturn: 2.2,
    risk: 'low',
    averageTerm: 12,
    allocatedVolume: 500000,
    results: 2.15,
  },
  {
    id: 'pool-2',
    name: 'Pool Performance',
    type: 'performance',
    targetReturn: 4.5,
    risk: 'high',
    averageTerm: 24,
    allocatedVolume: 300000,
    results: 5.2,
  },
  {
    id: 'pool-3',
    name: 'Pool Misto',
    type: 'mixed',
    targetReturn: 3.2,
    risk: 'medium',
    averageTerm: 18,
    allocatedVolume: 800000,
    results: 3.5,
  },
];

// Generate monthly data for charts
export function generateMonthlyData(months: number = 12): MonthlyData[] {
  const data: MonthlyData[] = [];
  const base = 2.0;
  const performanceBase = 3.0;
  
  for (let i = 0; i < months; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - (months - i - 1));
    
    const baseReturn = base + (Math.random() * 0.4); // 2.0% to 2.4%
    const performanceReturn = performanceBase + (Math.random() * 2.0); // 3.0% to 5.0%
    
    data.push({
      month: date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
      value: 100000 + (i * 5000) + (Math.random() * 3000),
      baseReturn,
      performanceReturn,
    });
  }
  
  return data;
}

// Generate portfolio evolution
export function generatePortfolioEvolution(months: number = 12): { month: string; value: number }[] {
  const data: { month: string; value: number }[] = [];
  let currentValue = 50000;
  
  for (let i = 0; i < months; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - (months - i - 1));
    
    // Simulate growth with some volatility
    const monthlyReturn = 0.02 + (Math.random() * 0.03); // 2% to 5%
    currentValue = currentValue * (1 + monthlyReturn);
    
    // Add deposits at certain months
    if (i === 2) currentValue += 30000;
    if (i === 5) currentValue += 20000;
    
    data.push({
      month: date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
      value: Math.round(currentValue),
    });
  }
  
  return data;
}
