'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { 
  Bell, 
  Shield, 
  Globe, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Save,
  Key
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ConfiguracoesPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  });
  const [language, setLanguage] = useState('pt-BR');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Configurações salvas com sucesso!');
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Configurações</h1>
        <p className="text-prospere-gray-400">Personalize sua experiência na plataforma</p>
      </div>

      {/* Notificações */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-prospere-red" />
          <h2 className="text-xl font-bold text-white">Notificações</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-prospere-gray-800 rounded-lg">
            <div>
              <p className="text-white font-medium">Notificações por E-mail</p>
              <p className="text-sm text-prospere-gray-400">Receba atualizações importantes por e-mail</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-prospere-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-prospere-red/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-prospere-red"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-prospere-gray-800 rounded-lg">
            <div>
              <p className="text-white font-medium">Notificações Push</p>
              <p className="text-sm text-prospere-gray-400">Receba notificações no navegador</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-prospere-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-prospere-red/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-prospere-red"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-prospere-gray-800 rounded-lg">
            <div>
              <p className="text-white font-medium">Notificações SMS</p>
              <p className="text-sm text-prospere-gray-400">Receba notificações por SMS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-prospere-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-prospere-red/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-prospere-red"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Idioma */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-6 h-6 text-prospere-red" />
          <h2 className="text-xl font-bold text-white">Idioma e Região</h2>
        </div>
        <div className="space-y-4">
          <Select
            label="Idioma"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            options={[
              { value: 'pt-BR', label: 'Português (Brasil)' },
              { value: 'en-US', label: 'English (US)' },
              { value: 'es-ES', label: 'Español' },
            ]}
          />
        </div>
      </Card>

      {/* Segurança */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-prospere-red" />
          <h2 className="text-xl font-bold text-white">Segurança</h2>
        </div>
        <div className="space-y-4">
          <div className="relative">
            <Input
              label="Senha Atual"
              type={showPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Digite sua senha atual"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-prospere-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <Input
            label="Nova Senha"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Digite sua nova senha"
          />
          <Input
            label="Confirmar Nova Senha"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirme sua nova senha"
          />
          {newPassword && confirmPassword && newPassword !== confirmPassword && (
            <p className="text-sm text-red-400">As senhas não coincidem</p>
          )}
        </div>
      </Card>

      {/* Ações */}
      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
        <Button variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
