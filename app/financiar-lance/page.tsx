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
  const valorParcela = parcelasNum > 0 ? valorLanceNum / parcelasNum : 0;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Financiar Lance</h1>
        <p className="text-prospere-gray-400">Financie seu lance de consórcio de forma lastreada</p>
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
                  <span className="text-prospere-gray-400">Número de Parcelas</span>
                  <span className="text-white font-medium">{parcelasNum}</span>
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
                  <p className="text-sm text-yellow-400 font-medium mb-1">Financiamento Lastreado</p>
                  <p className="text-xs text-prospere-gray-400">
                    O financiamento do lance é garantido por cartas de consórcio contempladas em nosso portfólio.
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
                  <p className="text-white font-medium mb-1">100% Lastreado</p>
                  <p className="text-sm text-prospere-gray-400">
                    Seu financiamento é garantido por cartas contempladas.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-prospere-gray-800 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium mb-1">Taxas Competitivas</p>
                  <p className="text-sm text-prospere-gray-400">
                    Condições especiais para financiamento de lances.
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
