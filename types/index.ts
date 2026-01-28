export interface Investor {
  id: string;
  name: string;
  email: string;
  cpf: string;
  createdAt: Date;
}

export interface MonthlyReturn {
  id: string;
  investmentId: string;
  month: string; // "2024-11" format
  returnPercentage: number; // 15 = 15%
  applied: boolean;
  createdAt: Date;
}

export interface Investment {
  id: string;
  investorId: string;
  amount: number;
  type: 'single' | 'recurring';
  pool: 'base' | 'performance' | 'mixed';
  date: Date;
  status: 'active' | 'withdrawn';
  monthlyReturns?: MonthlyReturn[]; // Rentabilidades mensais definidas pelo admin
}

export interface Transaction {
  id: string;
  investorId: string;
  type: 'deposit' | 'base_return' | 'performance_return' | 'reinvestment' | 'withdrawal';
  amount: number;
  date: Date;
  description: string;
  relatedInvestmentId?: string;
}

export interface Withdrawal {
  id: string;
  investorId: string;
  amount: number;
  requestedDate: Date;
  expectedPaymentDate: Date;
  status: 'pending' | 'in_liquidation' | 'paid';
  type: 'partial' | 'total';
}

export interface PortfolioMetrics {
  totalInvested: number;
  totalInOperation: number;
  totalProfit: number;
  averageReturn: number;
  monthlyReturn: number;
  availableBalance: number;
  blockedBalance: number;
  inWithdrawalBalance: number;
}

export interface Pool {
  id: string;
  name: string;
  type: 'base' | 'performance' | 'mixed';
  targetReturn: number;
  risk: 'low' | 'medium' | 'high';
  averageTerm: number;
  allocatedVolume: number;
  results: number;
}

export interface ProjectionScenario {
  conservative: number[];
  base: number[];
  aggressive: number[];
}

export interface MonthlyData {
  month: string;
  value: number;
  baseReturn: number;
  performanceReturn: number;
}
