'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { 
  ShoppingCart, 
  CreditCard,
  DollarSign,
  CheckCircle2,
  Filter,
  Search
} from 'lucide-react';
import { formatCurrency } from '@/lib/calculations';
import { motion } from 'framer-motion';

interface Carta {
  id: string;
  tipo: string;
  grupo: string;
  cota: string;
  valor: number;
  status: 'contemplada' | 'nao_contemplada';
  disponivel: boolean;
  lastreada: boolean;
}

const mockCartas: Carta[] = [
  {
    id: 'CART-001',
    tipo: 'Imóvel',
    grupo: '12345',
    cota: '678',
    valor: 300000,
    status: 'contemplada',
    disponivel: true,
    lastreada: true,
  },
  {
    id: 'CART-002',
    tipo: 'Veículo',
    grupo: '54321',
    cota: '123',
    valor: 80000,
    status: 'contemplada',
    disponivel: true,
    lastreada: true,
  },
  {
    id: 'CART-003',
    tipo: 'Imóvel',
    grupo: '67890',
    cota: '456',
    valor: 250000,
    status: 'nao_contemplada',
    disponivel: true,
    lastreada: true,
  },
];

export default function CartasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const filteredCartas = mockCartas.filter(carta => {
    const matchesSearch = carta.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carta.grupo.includes(searchTerm) || carta.cota.includes(searchTerm);
    const matchesTipo = filterTipo === 'all' || carta.tipo.toLowerCase() === filterTipo;
    const matchesStatus = filterStatus === 'all' || carta.status === filterStatus;
    
    return matchesSearch && matchesTipo && matchesStatus && carta.disponivel;
  });
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Comprar Cartas</h1>
        <p className="text-prospere-gray-400">Cartas de consórcio lastreadas disponíveis para compra</p>
      </div>
      
      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Buscar"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ID, Grupo ou Cota..."
            />
          </div>
          <Select
            label="Tipo"
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            options={[
              { value: 'all', label: 'Todos' },
              { value: 'imovel', label: 'Imóvel' },
              { value: 'veiculo', label: 'Veículo' },
            ]}
          />
          <Select
            label="Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: 'all', label: 'Todos' },
              { value: 'contemplada', label: 'Contemplada' },
              { value: 'nao_contemplada', label: 'Não Contemplada' },
            ]}
          />
        </div>
      </Card>
      
      {/* Cartas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCartas.map((carta, index) => (
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
                    <p className="text-sm text-prospere-gray-400">
                      {carta.id}
                    </p>
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
              
              <Button className="w-full mt-4">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Comprar Carta
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {filteredCartas.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-prospere-gray-600 mx-auto mb-4" />
            <p className="text-prospere-gray-400">Nenhuma carta encontrada</p>
          </div>
        </Card>
      )}
    </div>
  );
}
