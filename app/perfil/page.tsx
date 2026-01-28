'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { mockInvestor } from '@/lib/mockData';
import { useRouter } from 'next/navigation';

export default function PerfilPage() {
  const router = useRouter();
  const currentUser = getCurrentUser();
  const displayUser = currentUser || mockInvestor;
  
  const [name, setName] = useState(displayUser.name || '');
  const [email, setEmail] = useState(displayUser.email || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Perfil atualizado com sucesso!');
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Meu Perfil</h1>
        <p className="text-prospere-gray-400">Gerencie suas informações pessoais</p>
      </div>

      <Card>
        <div className="space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-prospere-gray-800">
            <div className="w-20 h-20 bg-prospere-red rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{name}</h2>
              <p className="text-prospere-gray-400">{email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Nome Completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Input
                label="E-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
              />
            </div>
            <div>
              <Input
                label="Telefone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div>
              <Input
                label="Endereço"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Rua, número, bairro"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-prospere-gray-800">
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
