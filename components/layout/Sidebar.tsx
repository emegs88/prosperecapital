'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calculator, 
  ArrowLeftRight, 
  FileText, 
  Briefcase,
  Settings,
  TrendingUp,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  User,
  CreditCard,
  ShoppingCart,
  HandCoins
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { formatCurrency } from '@/lib/calculations';
import { mockInvestments, mockTransactions } from '@/lib/mockData';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/abertura-conta', label: 'Abertura de Conta', icon: User },
  { href: '/deposito', label: 'Depósitos', icon: ArrowDownCircle, hasSubmenu: true },
  { href: '/saque', label: 'Saques', icon: ArrowUpCircle, hasSubmenu: false },
  { href: '/consorcio', label: 'Consórcio', icon: CreditCard, hasSubmenu: true },
  { href: '/cartas', label: 'Cartas', icon: ShoppingCart, hasSubmenu: true },
  { href: '/financiar-lance', label: 'Financiar Lance', icon: HandCoins },
  { href: '/resgate', label: 'Resgate', icon: ArrowLeftRight },
  { href: '/extrato', label: 'Extrato', icon: FileText },
  { href: '/pools', label: 'Pools', icon: Briefcase },
  { href: '/admin', label: 'Admin', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['deposito']);
  
  // Calculate available balance
  const totalInvested = mockInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalProfit = mockTransactions
    .filter(tx => tx.type === 'base_return' || tx.type === 'performance_return')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const availableBalance = totalInvested + totalProfit;
  
  const toggleMenu = (menu: string) => {
    setExpandedMenus(prev => 
      prev.includes(menu) 
        ? prev.filter(m => m !== menu)
        : [...prev, menu]
    );
  };
  
  const isMenuExpanded = (menu: string) => expandedMenus.includes(menu);
  
  return (
    <aside className="hidden lg:block w-80 bg-prospere-dark border-r border-prospere-gray-800 h-screen fixed left-0 top-0 z-40 overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-prospere-gray-800">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-prospere-red" />
          <div>
            <h1 className="text-xl font-bold text-white">Prospere</h1>
            <p className="text-xs text-prospere-gray-500">Capital</p>
          </div>
        </div>
      </div>
      
      {/* Account Summary */}
      <div className="p-6 border-b border-prospere-gray-800">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-prospere-gray-400 uppercase">Saldo Disponível</p>
          <RefreshCw className="w-4 h-4 text-prospere-gray-500 cursor-pointer hover:text-white transition-colors" />
        </div>
        <p className="text-3xl font-bold text-white">
          {formatCurrency(availableBalance)}
        </p>
        <p className="text-xs text-prospere-gray-500 mt-2">
          Lastreado em cartas de consórcio
        </p>
      </div>
      
      {/* Account Status */}
      <div className="p-6 border-b border-prospere-gray-800 space-y-3">
        <div>
          <p className="text-xs text-prospere-gray-400 mb-1">Status da conta</p>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-900/30 border border-green-800 text-green-400 rounded-full text-xs font-medium">
            <CheckCircle2 className="w-3 h-3" />
            ATIVADO
          </span>
        </div>
        <div>
          <p className="text-xs text-prospere-gray-400 mb-1">Validação de documentos</p>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-900/30 border border-green-800 text-green-400 rounded-full text-xs font-medium">
            <CheckCircle2 className="w-3 h-3" />
            APROVADO
          </span>
        </div>
        <div>
          <p className="text-xs text-prospere-gray-400 mb-1">Tipo de conta</p>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-900/30 border border-yellow-800 text-yellow-400 rounded-full text-xs font-medium">
            INVESTIDOR
          </span>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="p-6 border-b border-prospere-gray-800 space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/deposito')}
          className="w-full bg-prospere-gold hover:bg-yellow-600 text-prospere-black font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <ArrowDownCircle className="w-5 h-5" />
          DEPOSITAR
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/saque')}
          className="w-full bg-prospere-gray-800 hover:bg-prospere-gray-700 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <ArrowUpCircle className="w-5 h-5" />
          SACAR
        </motion.button>
      </div>
      
      {/* Main Menu */}
      <div className="p-4">
        <p className="text-xs font-semibold text-prospere-gray-500 uppercase mb-3 px-2">Menu Principal</p>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const isExpanded = item.hasSubmenu && isMenuExpanded(item.href.replace('/', ''));
            
            return (
              <div key={item.href}>
                <div
                  onClick={() => item.hasSubmenu ? toggleMenu(item.href.replace('/', '')) : router.push(item.href)}
                  className={cn(
                    'flex items-center justify-between px-4 py-3 rounded-lg transition-colors cursor-pointer',
                    isActive
                      ? 'bg-prospere-red text-white'
                      : 'text-prospere-gray-400 hover:bg-prospere-gray-900 hover:text-white'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.hasSubmenu ? (
                    isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )
                  ) : null}
                </div>
                
                {item.hasSubmenu && isExpanded && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-prospere-gray-800 pl-4">
                    {item.href === '/deposito' && (
                      <>
                        <Link href="/deposito">
                          <div className={cn(
                            'px-4 py-2 rounded-lg transition-colors text-sm',
                            pathname === '/deposito'
                              ? 'bg-prospere-red/20 text-prospere-red'
                              : 'text-prospere-gray-500 hover:bg-prospere-gray-900 hover:text-white'
                          )}>
                            Novo Depósito
                          </div>
                        </Link>
                        <Link href="/deposito/meus-depositos">
                          <div className={cn(
                            'px-4 py-2 rounded-lg transition-colors text-sm',
                            pathname === '/deposito/meus-depositos'
                              ? 'bg-prospere-red/20 text-prospere-red'
                              : 'text-prospere-gray-500 hover:bg-prospere-gray-900 hover:text-white'
                          )}>
                            Meus Depósitos
                          </div>
                        </Link>
                      </>
                    )}
                    {item.href === '/consorcio' && (
                      <>
                        <Link href="/consorcio">
                          <div className={cn(
                            'px-4 py-2 rounded-lg transition-colors text-sm',
                            pathname === '/consorcio'
                              ? 'bg-prospere-red/20 text-prospere-red'
                              : 'text-prospere-gray-500 hover:bg-prospere-gray-900 hover:text-white'
                          )}>
                            Meus Consórcios
                          </div>
                        </Link>
                        <Link href="/consorcio/entrada-contemplada">
                          <div className={cn(
                            'px-4 py-2 rounded-lg transition-colors text-sm',
                            pathname === '/consorcio/entrada-contemplada'
                              ? 'bg-prospere-red/20 text-prospere-red'
                              : 'text-prospere-gray-500 hover:bg-prospere-gray-900 hover:text-white'
                          )}>
                            Entrada Contemplada
                          </div>
                        </Link>
                      </>
                    )}
                    {item.href === '/cartas' && (
                      <>
                        <Link href="/cartas">
                          <div className={cn(
                            'px-4 py-2 rounded-lg transition-colors text-sm',
                            pathname === '/cartas'
                              ? 'bg-prospere-red/20 text-prospere-red'
                              : 'text-prospere-gray-500 hover:bg-prospere-gray-900 hover:text-white'
                          )}>
                            Comprar Cartas
                          </div>
                        </Link>
                        <Link href="/cartas/vender">
                          <div className={cn(
                            'px-4 py-2 rounded-lg transition-colors text-sm',
                            pathname === '/cartas/vender'
                              ? 'bg-prospere-red/20 text-prospere-red'
                              : 'text-prospere-gray-500 hover:bg-prospere-gray-900 hover:text-white'
                          )}>
                            Vender Cartas
                          </div>
                        </Link>
                        <Link href="/cartas/minhas-cartas">
                          <div className={cn(
                            'px-4 py-2 rounded-lg transition-colors text-sm',
                            pathname === '/cartas/minhas-cartas'
                              ? 'bg-prospere-red/20 text-prospere-red'
                              : 'text-prospere-gray-500 hover:bg-prospere-gray-900 hover:text-white'
                          )}>
                            Minhas Cartas
                          </div>
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
