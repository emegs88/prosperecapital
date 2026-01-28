'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MetricCard } from '@/components/ui/Card';
import { 
  CreditCard, 
  DollarSign,
  CheckCircle2,
  Clock,
  TrendingUp
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/calculations';
import { motion } from 'framer-motion';

interface MinhaCarta {
  id: string;
  tipo: string;
  grupo: string;
  cota: string;
  valor: number;
  status: 'contemplada' | 'nao_contemplada';
  dataAquisicao: Date;
  lastreada: boolean;
}

const minhasCartas: MinhaCarta[] = [
  {
    id: 'CART-004',
    tipo: 'Imóvel',
    grupo: '11111',
    cota: '999',
    valor: 350000,
    status: 'contemplada',
    dataAquisicao: new Date('2023-01-15'),
    lastreada: true,
  },
  {
    id: 'CART-005',
    tipo: 'Veículo',
    grupo: '22222',
    cota: '888',
    valor: 90000,
    status: 'nao_contemplada',
    dataAquisicao: new Date('2023-03-20'),
    lastreada: true,
  },
  {
    id: 'CART-006',
    tipo: 'Imóvel',
    grupo: '33333',
    cota: '777',
    valor: 280000,
    status: 'contemplada',
    dataAquisicao: new Date('2023-05-10'),
    lastreada: true,
  },
];

export default function MinhasCartasPage() {
  const totalInvestido = minhasCartas.reduce((sum, c) => sum + c.valor, 0);
  const cartasContempladas = minhasCartas.filter(c => c.status === 'contemplada').length;
  const cartasNaoContempladas = minhasCartas.filter(c => c.status === 'nao_contemplada').length;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Minhas Cartas</h1>
        <p className="text-prospere-gray-400">Cartas de consórcio lastreadas em sua carteira</p>
      </div>
      
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Investido"
          value={formatCurrency(totalInvestido)}
          icon={<DollarSign className="w-10 h-10" />}
        />
        <MetricCard
          title="Cartas Contempladas"
          value={cartasContempladas.toString()}
          icon={<CheckCircle2 className="w-10 h-10" />}
        />
        <MetricCard
          title="Cartas Não Contempladas"
          value={cartasNaoContempladas.toString()}
          icon={<Clock className="w-10 h-10" />}
        />
      </div>
      
      {/* Cartas List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {minhasCartas.map((carta, index) => (
          <motion.div
            key={carta.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-prospere-red/20 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-prospere-red" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{carta.tipo}</h3>
                    <p className="text-sm text-prospere-gray-400">{carta.id}</p>
                  </div>
                </div>
                {carta.lastreada && (
                  <span className="px-2 py-1 bg-green-900/30 border border-green-800 text-green-400 text-xs rounded">
                    Lastreada
                  </span>
                )}
              </div>
              
              <div className="space-y-3 flex-1">
                <div>
                  <p className="text-xs text-prospere-gray-400 mb-1">Grupo / Cota</p>
                  <p className="text-white font-medium">
                    {carta.grupo} - {carta.cota}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-prospere-gray-400 mb-1">Valor</p>
                  <p className="text-2xl font-bold text-prospere-gold">
                    {formatCurrency(carta.valor)}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-prospere-gray-400 mb-1">Data de Aquisição</p>
                  <p className="text-white text-sm">
                    {formatDate(carta.dataAquisicao)}
                  </p>
                </div>
                
                <div>
                  <span className={`
                    inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium
                    ${carta.status === 'contemplada'
                      ? 'bg-green-900/30 border border-green-800 text-green-400'
                      : 'bg-yellow-900/30 border border-yellow-800 text-yellow-400'
                    }
                  `}>
                    {carta.status === 'contemplada' && (
                      <CheckCircle2 className="w-3 h-3" />
                    )}
                    {carta.status === 'contemplada' ? 'Contemplada' : 'Não Contemplada'}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  Detalhes
                </Button>
                <Button size="sm" className="flex-1">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Vender
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
