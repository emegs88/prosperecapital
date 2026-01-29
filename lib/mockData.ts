import { 
  Investor, 
  Investment, 
  Transaction, 
  Withdrawal, 
  Pool,
  MonthlyData,
  MonthlyReturn
} from '@/types';

// Mock Investor (padrão - será substituído pelo usuário logado)
export const mockInvestor: Investor = {
  id: '1',
  name: 'Investidor',
  email: 'investidor@example.com',
  cpf: '000.000.000-00',
  createdAt: new Date(),
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
  {
    id: '4',
    name: 'Rick Dias',
    email: 'rickdiasdiasdias@gmail.com',
    cpf: '123.456.789-00',
    createdAt: new Date('2024-12-01'),
  },
];

// Mock Monthly Returns (rentabilidades definidas pelo admin)
// ZERADO - Admin deve adicionar manualmente através do painel
export const mockMonthlyReturns: MonthlyReturn[] = [];

// Mock Investments
// ZERADO - Admin deve adicionar investimentos manualmente através do painel
export const mockInvestments: Investment[] = [];

// Mock Transactions
// ZERADO - Transações serão criadas automaticamente quando admin adicionar investimentos
export const mockTransactions: Transaction[] = [];

// Mock Withdrawals
// ZERADO - Resgates serão criados quando investidores solicitarem
export const mockWithdrawals: Withdrawal[] = [];

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

// Generate comparison data with other investments
export function generateInvestmentComparison(months: number = 12): {
  month: string;
  prospere: number;
  cdi: number;
  selic: number;
  poupanca: number;
  ipca: number;
  tesouroIpca: number;
}[] {
  const data: {
    month: string;
    prospere: number;
    cdi: number;
    selic: number;
    poupanca: number;
    ipca: number;
    tesouroIpca: number;
  }[] = [];
  
  // Starting values (normalized to 100)
  let prospereValue = 100;
  let cdiValue = 100;
  let selicValue = 100;
  let poupancaValue = 100;
  let ipcaValue = 100;
  let tesouroIpcaValue = 100;
  
  for (let i = 0; i < months; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - (months - i - 1));
    
    // Prospere Capital: 2.2% to 3.5% monthly (consortium operations)
    const prospereReturn = 0.022 + (Math.random() * 0.013);
    prospereValue = prospereValue * (1 + prospereReturn);
    
    // CDI: ~1.0% monthly (12% annual)
    const cdiReturn = 0.01 + (Math.random() * 0.002);
    cdiValue = cdiValue * (1 + cdiReturn);
    
    // Selic: ~0.9% monthly (10.5% annual)
    const selicReturn = 0.009 + (Math.random() * 0.001);
    selicValue = selicValue * (1 + selicReturn);
    
    // Poupança: ~0.5% monthly (6% annual)
    const poupancaReturn = 0.005 + (Math.random() * 0.001);
    poupancaValue = poupancaValue * (1 + poupancaReturn);
    
    // IPCA: ~0.4% monthly (5% annual)
    const ipcaReturn = 0.004 + (Math.random() * 0.001);
    ipcaValue = ipcaValue * (1 + ipcaReturn);
    
    // Tesouro IPCA+: ~0.6% monthly (7.5% annual)
    const tesouroReturn = 0.006 + (Math.random() * 0.001);
    tesouroIpcaValue = tesouroIpcaValue * (1 + tesouroReturn);
    
    data.push({
      month: date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
      prospere: Math.round(prospereValue * 100) / 100,
      cdi: Math.round(cdiValue * 100) / 100,
      selic: Math.round(selicValue * 100) / 100,
      poupanca: Math.round(poupancaValue * 100) / 100,
      ipca: Math.round(ipcaValue * 100) / 100,
      tesouroIpca: Math.round(tesouroIpcaValue * 100) / 100,
    });
  }
  
  return data;
}

// Calculate current value of investment based on monthly returns
export function calculateInvestmentCurrentValue(investment: Investment): number {
  if (!investment.monthlyReturns || investment.monthlyReturns.length === 0) {
    return investment.amount;
  }
  
  let currentValue = investment.amount;
  
  // Sort returns by month
  const sortedReturns = [...investment.monthlyReturns].sort((a, b) => 
    a.month.localeCompare(b.month)
  );
  
  // Apply returns sequentially
  for (const monthlyReturn of sortedReturns) {
    if (monthlyReturn.applied) {
      currentValue = currentValue * (1 + monthlyReturn.returnPercentage / 100);
    }
  }
  
  return Math.round(currentValue * 100) / 100;
}

// Get investment evolution with monthly returns
export function getInvestmentEvolution(investment: Investment): {
  month: string;
  value: number;
  returnPercentage: number;
}[] {
  const evolution: { month: string; value: number; returnPercentage: number }[] = [];
  let currentValue = investment.amount;
  
  // Add initial value
  const investmentDate = new Date(investment.date);
  evolution.push({
    month: investmentDate.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
    value: currentValue,
    returnPercentage: 0,
  });
  
  if (investment.monthlyReturns && investment.monthlyReturns.length > 0) {
    const sortedReturns = [...investment.monthlyReturns].sort((a, b) => 
      a.month.localeCompare(b.month)
    );
    
    for (const monthlyReturn of sortedReturns) {
      if (monthlyReturn.applied) {
        currentValue = currentValue * (1 + monthlyReturn.returnPercentage / 100);
        const [year, month] = monthlyReturn.month.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        evolution.push({
          month: date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
          value: Math.round(currentValue * 100) / 100,
          returnPercentage: monthlyReturn.returnPercentage,
        });
      }
    }
  }
  
  return evolution;
}
