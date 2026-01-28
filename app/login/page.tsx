'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TrendingUp, Mail, Lock, AlertCircle } from 'lucide-react';
import { verifyLogin } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simula delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = verifyLogin(email, password);
    
    if (user) {
      // Em produção, salvaria token/session
      localStorage.setItem('user', JSON.stringify(user));
      router.push('/');
    } else {
      setError('Email ou senha incorretos');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-prospere-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingUp className="w-10 h-10 text-prospere-red" />
              <div>
                <h1 className="text-2xl font-bold text-white">Prospere</h1>
                <p className="text-xs text-prospere-gray-500">Capital</p>
              </div>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Acesso à Plataforma</h2>
            <p className="text-sm text-prospere-gray-400">Entre com suas credenciais</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-prospere-gray-300 mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-prospere-gray-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-prospere-gray-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-prospere-gray-400" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-prospere-gray-800">
            <p className="text-xs text-center text-prospere-gray-500">
              Não tem uma conta?{' '}
              <a href="/abertura-conta" className="text-prospere-red hover:underline">
                Criar conta
              </a>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
