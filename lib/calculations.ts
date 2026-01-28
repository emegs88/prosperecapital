import { ProjectionScenario } from '@/types';

/**
 * Calculate compound interest projection
 */
export function calculateCompoundInterest(
  principal: number,
  monthlyRate: number,
  months: number,
  monthlyDeposit: number = 0
): number {
  if (monthlyRate === 0) {
    return principal + (monthlyDeposit * months);
  }
  
  const futureValue = principal * Math.pow(1 + monthlyRate, months);
  const depositFutureValue = monthlyDeposit > 0
    ? monthlyDeposit * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
    : 0;
  
  return futureValue + depositFutureValue;
}

/**
 * Generate monthly projection data
 */
export function generateMonthlyProjection(
  initialAmount: number,
  monthlyRate: number,
  months: number,
  monthlyDeposit: number = 0,
  reinvest: boolean = true
): number[] {
  const projection: number[] = [];
  let currentValue = initialAmount;
  
  for (let i = 0; i <= months; i++) {
    projection.push(Math.round(currentValue));
    
    if (i < months) {
      // Apply monthly return
      if (reinvest) {
        currentValue = currentValue * (1 + monthlyRate);
      }
      
      // Add monthly deposit
      if (monthlyDeposit > 0) {
        currentValue += monthlyDeposit;
      }
    }
  }
  
  return projection;
}

/**
 * Generate projection scenarios
 */
export function generateProjectionScenarios(
  initialAmount: number,
  months: number,
  monthlyDeposit: number = 0,
  reinvest: boolean = true
): ProjectionScenario {
  const baseRate = 0.032; // 3.2% average
  const conservativeRate = baseRate * 0.7; // 2.24%
  const aggressiveRate = baseRate * 1.5; // 4.8%
  
  return {
    conservative: generateMonthlyProjection(
      initialAmount,
      conservativeRate,
      months,
      monthlyDeposit,
      reinvest
    ),
    base: generateMonthlyProjection(
      initialAmount,
      baseRate,
      months,
      monthlyDeposit,
      reinvest
    ),
    aggressive: generateMonthlyProjection(
      initialAmount,
      aggressiveRate,
      months,
      monthlyDeposit,
      reinvest
    ),
  };
}

/**
 * Calculate total profit from projection
 */
export function calculateTotalProfit(
  finalValue: number,
  initialAmount: number,
  totalDeposits: number
): number {
  return finalValue - initialAmount - totalDeposits;
}

/**
 * Calculate average return from projection
 */
export function calculateAverageReturn(
  finalValue: number,
  initialAmount: number,
  totalDeposits: number,
  months: number
): number {
  const totalInvested = initialAmount + totalDeposits;
  if (totalInvested === 0) return 0;
  
  const totalReturn = (finalValue / totalInvested) - 1;
  const monthlyReturn = Math.pow(1 + totalReturn, 1 / months) - 1;
  
  return monthlyReturn * 100; // Return as percentage
}

/**
 * Format currency
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format date
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/**
 * Add days to date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
