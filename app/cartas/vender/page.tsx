'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { 
  CreditCard, 
  DollarSign,
  AlertCircle,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { formatCurrency } from '@/lib/calculations';
import { motion } from 'framer-motion';

interface MinhaCarta {
  id: string;
  tipo: string;
  grupo: string;
  cota: string;
  valor: number;
  status: 'contemplada' | 'nao_contemplada';
  dataAquisicao: Date;
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
  },
  {
    id: 'CART-005',
    tipo: 'Veículo',
    grupo: '22222',
    cota: '888',
    valor: 90000,
    status: 'nao_contemplada',
    dataAquisicao: new Date('2023-03-20'),
  },
];

export default function VenderCartasPage() {
  const [selectedCarta, setSelectedCarta] = useState<string>('');
  const [valorVenda, setValorVenda] = useState('');
  
  const cartaSelecionada = minhasCartas.find(c => c.id === selectedCarta);
  const valorVendaNum = Number(valorVenda) || 0;
  const lucroEstimado = cartaSelecionada ? valorVendaNum - cartaSelecionada.valor : 0;
  const percentualLucro = cartaSelecionada && cartaSelecionada.valor > 0 
    ? (lucroEstimado / cartaSelecionada.valor) * 100 
    : 0;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Vender Cartas</h1>
        <p className="text-prospere-gray-400">Venda suas cartas de consórcio lastreadas na plataforma BidCon</p>
        <div className="mt-4 p-4 bg-prospere-gray-900 border border-prospere-gray-700 rounded-lg">
          <p className="text-sm text-prospere-gray-300">
            <strong className="text-white">Como funciona:</strong> Sua carta será publicada na plataforma BidCon. Quando vendida com lucro, o lucro retorna para você. Se a carta foi comprada com recursos de investidores, o lucro será distribuído proporcionalmente entre os investidores que financiaram a compra.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <h2 className="text-xl font-bold text-white mb-4">Selecione a Carta</h2>
          
          <div className="space-y-4">
            <Select
              label="Minhas Cartas"
              value={selectedCarta}
              onChange={(e) => {
                setSelectedCarta(e.target.value);
                const carta = minhasCartas.find(c => c.id === e.target.value);
                if (carta) {
                  setValorVenda((carta.valor * 1.1).toFixed(2)); // Sugestão de 10% acima
                }
              }}
              options={[
                { value: '', label: 'Selecione uma carta...' },
                ...minhasCartas.map(c => ({
                  value: c.id,
                  label: `${c.tipo} - ${c.id} (Grupo ${c.grupo} - Cota ${c.cota})`,
                })),
              ]}
            />
            
            {cartaSelecionada && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-prospere-gray-800 rounded-lg border border-prospere-gray-700"
              >
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-prospere-gray-400">Tipo</span>
                    <span className="text-white font-medium">{cartaSelecionada.tipo}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-prospere-gray-400">Grupo / Cota</span>
                    <span className="text-white font-medium">
                      {cartaSelecionada.grupo} - {cartaSelecionada.cota}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-prospere-gray-400">Valor de Aquisição</span>
                    <span className="text-white font-medium">
                      {formatCurrency(cartaSelecionada.valor)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-prospere-gray-400">Status</span>
                    <span className={`
                      px-2 py-1 rounded text-xs font-medium
                      ${cartaSelecionada.status === 'contemplada'
                        ? 'bg-green-900/30 text-green-400'
                        : 'bg-yellow-900/30 text-yellow-400'
                      }
                    `}>
                      {cartaSelecionada.status === 'contemplada' ? 'Contemplada' : 'Não Contemplada'}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
            
            <Input
              label="Valor de Venda"
              type="number"
              value={valorVenda}
              onChange={(e) => setValorVenda(e.target.value)}
              placeholder="0,00"
              min={0}
            />
            
            {cartaSelecionada && valorVendaNum > 0 && (
              <div className="p-4 bg-prospere-gray-800 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-prospere-gray-400">Valor de Aquisição</span>
                    <span className="text-white">
                      {formatCurrency(cartaSelecionada.valor)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-prospere-gray-400">Valor de Venda</span>
                    <span className="text-white font-medium">
                      {formatCurrency(valorVendaNum)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-prospere-gray-700">
                    <span className="text-prospere-gray-400">Lucro Estimado</span>
                    <span className={`font-bold ${
                      lucroEstimado >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {formatCurrency(lucroEstimado)} ({percentualLucro >= 0 ? '+' : ''}{percentualLucro.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-400 font-medium mb-1">Venda na BidCon</p>
                  <p className="text-xs text-prospere-gray-400">
                    Sua carta será publicada na plataforma BidCon. Quando vendida, o lucro será creditado em sua conta.
                  </p>
                </div>
              </div>
            </div>
            
            <Button 
              size="lg" 
              className="w-full" 
              disabled={!selectedCarta || !valorVenda || valorVendaNum <= 0}
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Publicar Venda
            </Button>
          </div>
        </Card>
        
        {/* Info */}
        <Card>
          <h2 className="text-xl font-bold text-white mb-4">Informações</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-prospere-gray-800 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium mb-1">Processo Seguro</p>
                  <p className="text-sm text-prospere-gray-400">
                    Todas as vendas são processadas através de nosso sistema lastreado.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-prospere-gray-800 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium mb-1">Liquidação Rápida</p>
                  <p className="text-sm text-prospere-gray-400">
                    Receba o valor da venda em até 5 dias úteis após a confirmação.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-prospere-gray-800 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium mb-1">Taxa de Venda</p>
                  <p className="text-sm text-prospere-gray-400">
                    Taxa de 2% sobre o valor da venda será aplicada.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-900/20 border border-green-800 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <p className="text-sm text-green-400 font-medium mb-1">100% Lastreado</p>
                  <p className="text-xs text-prospere-gray-400">
                    Sua venda é garantida por nosso sistema de lastreamento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
