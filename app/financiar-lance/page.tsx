'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { 
  Coins, 
  CreditCard,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { formatCurrency } from '@/lib/calculations';

export default function FinanciarLancePage() {
  const [consorcioId, setConsorcioId] = useState('');
  const [valorLance, setValorLance] = useState('');
  const [parcelas, setParcelas] = useState('12');
  
  const consorcios = [
    { value: 'CONS-001', label: 'Consórcio Imóvel - Grupo 12345 - Cota 678' },
    { value: 'CONS-002', label: 'Consórcio Veículo - Grupo 54321 - Cota 123' },
  ];
  
  const valorLanceNum = Number(valorLance) || 0;
  const parcelasNum = Number(parcelas);
  const taxaEmprestimo = 0.025; // 2.5% ao mês
  const valorTotalComTaxa = valorLanceNum * (1 + (taxaEmprestimo * parcelasNum));
  const valorParcela = parcelasNum > 0 ? valorTotalComTaxa / parcelasNum : 0;
  const valorTaxa = valorTotalComTaxa - valorLanceNum;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Financiar Lance</h1>
        <p className="text-prospere-gray-400">Use seus recursos investidos para financiar lances de consórcio</p>
        <div className="mt-4 p-4 bg-prospere-gray-900 border border-prospere-gray-700 rounded-lg">
          <p className="text-sm text-prospere-gray-300">
            <strong className="text-white">Como funciona:</strong> Você pode usar parte do seu capital investido para pagar o lance de consórcio de outro cliente. Cobramos uma taxa de empréstimo. Quando a administradora pagar, o crédito fica retido (valor emprestado + lucro da taxa).
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <h2 className="text-xl font-bold text-white mb-4">Informações do Lance</h2>
          
          <div className="space-y-4">
            <Select
              label="Consórcio"
              value={consorcioId}
              onChange={(e) => setConsorcioId(e.target.value)}
              options={[
                { value: '', label: 'Selecione um consórcio...' },
                ...consorcios,
              ]}
            />
            
            <Input
              label="Valor do Lance"
              type="number"
              value={valorLance}
              onChange={(e) => setValorLance(e.target.value)}
              placeholder="0,00"
              min={0}
            />
            
            <Select
              label="Parcelas"
              value={parcelas}
              onChange={(e) => setParcelas(e.target.value)}
              options={[
                { value: '6', label: '6 parcelas' },
                { value: '12', label: '12 parcelas' },
                { value: '24', label: '24 parcelas' },
                { value: '36', label: '36 parcelas' },
                { value: '48', label: '48 parcelas' },
              ]}
            />
            
            <div className="p-4 bg-prospere-gray-800 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-prospere-gray-400">Valor do Lance</span>
                  <span className="text-white font-medium">
                    {formatCurrency(valorLanceNum)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-prospere-gray-400">Taxa de Empréstimo</span>
                  <span className="text-white font-medium">
                    {(taxaEmprestimo * 100).toFixed(1)}% ao mês
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-prospere-gray-400">Número de Parcelas</span>
                  <span className="text-white font-medium">{parcelasNum}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-prospere-gray-400">Valor da Taxa</span>
                  <span className="text-yellow-400 font-medium">
                    {formatCurrency(valorTaxa)}
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-prospere-gray-700">
                  <span className="text-prospere-gray-400">Valor Total (Lance + Taxa)</span>
                  <span className="text-white font-bold">
                    {formatCurrency(valorTotalComTaxa)}
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-prospere-gray-700">
                  <span className="text-prospere-gray-400">Valor da Parcela</span>
                  <span className="text-white font-bold text-lg">
                    {formatCurrency(valorParcela)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-400 font-medium mb-1">Retenção de Crédito</p>
                  <p className="text-xs text-prospere-gray-400">
                    Quando a administradora pagar, o crédito ficará retido (valor emprestado + lucro da taxa) até a quitação completa.
                  </p>
                </div>
              </div>
            </div>
            
            <Button size="lg" className="w-full" disabled={!consorcioId || !valorLance}>
              <Coins className="w-5 h-5 mr-2" />
              Solicitar Financiamento
            </Button>
          </div>
        </Card>
        
        {/* Info */}
        <Card>
          <h2 className="text-xl font-bold text-white mb-4">Vantagens</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-prospere-gray-800 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium mb-1">Use Seu Capital Investido</p>
                  <p className="text-sm text-prospere-gray-400">
                    Utilize parte do seu capital investido para financiar lances de outros clientes.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-prospere-gray-800 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium mb-1">Taxa de Empréstimo</p>
                  <p className="text-sm text-prospere-gray-400">
                    Cobramos uma taxa de empréstimo sobre o valor financiado. O lucro retorna para você quando a administradora pagar.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-prospere-gray-800 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium mb-1">Processo Rápido</p>
                  <p className="text-sm text-prospere-gray-400">
                    Aprovação e liberação em até 48 horas.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-prospere-gray-800 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium mb-1">Flexibilidade</p>
                  <p className="text-sm text-prospere-gray-400">
                    Escolha o número de parcelas que melhor se adequa ao seu perfil.
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
