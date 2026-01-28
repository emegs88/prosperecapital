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
  CheckCircle2
} from 'lucide-react';
import { formatCurrency } from '@/lib/calculations';

export default function EntradaContempladaPage() {
  const [valorEntrada, setValorEntrada] = useState('');
  const [tipoConsorcio, setTipoConsorcio] = useState('');
  const [valorCarta, setValorCarta] = useState('');
  
  const tiposConsorcio = [
    { value: 'imovel', label: 'Imóvel' },
    { value: 'veiculo', label: 'Veículo' },
    { value: 'servicos', label: 'Serviços' },
  ];
  
  const valorEntradaNum = Number(valorEntrada) || 0;
  const valorCartaNum = Number(valorCarta) || 0;
  const valorFinanciado = Math.max(0, valorCartaNum - valorEntradaNum);
  const percentualEntrada = valorCartaNum > 0 ? (valorEntradaNum / valorCartaNum) * 100 : 0;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Entrada em Carta Contemplada</h1>
        <p className="text-prospere-gray-400">Adquira entrada em carta de consórcio contemplada</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <h2 className="text-xl font-bold text-white mb-4">Informações da Entrada</h2>
          
          <div className="space-y-4">
            <Select
              label="Tipo de Consórcio"
              value={tipoConsorcio}
              onChange={(e) => setTipoConsorcio(e.target.value)}
              options={[
                { value: '', label: 'Selecione...' },
                ...tiposConsorcio,
              ]}
            />
            
            <Input
              label="Valor da Carta Contemplada"
              type="number"
              value={valorCarta}
              onChange={(e) => setValorCarta(e.target.value)}
              placeholder="0,00"
              min={0}
            />
            
            <Input
              label="Valor da Entrada"
              type="number"
              value={valorEntrada}
              onChange={(e) => setValorEntrada(e.target.value)}
              placeholder="0,00"
              min={0}
            />
            
            <div className="p-4 bg-prospere-gray-800 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-prospere-gray-400">Valor da Carta</span>
                  <span className="text-white font-medium">
                    {formatCurrency(valorCartaNum)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-prospere-gray-400">Valor da Entrada</span>
                  <span className="text-white font-medium">
                    {formatCurrency(valorEntradaNum)}
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-prospere-gray-700">
                  <span className="text-prospere-gray-400">Valor a Financiar</span>
                  <span className="text-white font-bold">
                    {formatCurrency(valorFinanciado)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-prospere-gray-400">% de Entrada</span>
                  <span className="text-prospere-gold font-bold">
                    {percentualEntrada.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-400 font-medium mb-1">Carta Lastreada</p>
                  <p className="text-xs text-prospere-gray-400">
                    Esta operação é lastreada em carta de consórcio contemplada, garantindo segurança e rentabilidade.
                  </p>
                </div>
              </div>
            </div>
            
            <Button size="lg" className="w-full">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Confirmar Entrada
            </Button>
          </div>
        </Card>
        
        {/* Info */}
        <Card>
          <h2 className="text-xl font-bold text-white mb-4">Como Funciona</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-prospere-gray-800 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-prospere-red/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-prospere-red font-bold">1</span>
                </div>
                <div>
                  <p className="text-white font-medium mb-1">Selecione a Carta</p>
                  <p className="text-sm text-prospere-gray-400">
                    Escolha uma carta de consórcio contemplada disponível em nosso portfólio.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-prospere-gray-800 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-prospere-red/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-prospere-red font-bold">2</span>
                </div>
                <div>
                  <p className="text-white font-medium mb-1">Defina a Entrada</p>
                  <p className="text-sm text-prospere-gray-400">
                    Informe o valor da entrada que deseja investir na carta contemplada.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-prospere-gray-800 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-prospere-red/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-prospere-red font-bold">3</span>
                </div>
                <div>
                  <p className="text-white font-medium mb-1">Financiamento</p>
                  <p className="text-sm text-prospere-gray-400">
                    O valor restante será financiado através de nosso sistema de consórcio.
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
                    Todas as operações são lastreadas em cartas contempladas, garantindo segurança total.
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
