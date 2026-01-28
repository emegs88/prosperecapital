'use client';

import { Bell, User, Sun, Moon, ChevronDown, Plus, ArrowDownCircle, LogOut, Settings, UserCircle } from 'lucide-react';
import { mockInvestor } from '@/lib/mockData';
import { getCurrentUser } from '@/lib/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const isDepositPage = pathname?.includes('/deposito');
  const currentUser = getCurrentUser();
  const displayUser = currentUser ? {
    email: currentUser.email,
    name: currentUser.name,
  } : {
    email: mockInvestor.email,
    name: mockInvestor.name,
  };

  // Fechar menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = () => {
    // Limpar dados de autenticação
    localStorage.removeItem('user');
    // Redirecionar para login
    router.push('/login');
    setShowUserMenu(false);
  };

  const handleProfile = () => {
    router.push('/perfil');
    setShowUserMenu(false);
  };

  const handleSettings = () => {
    router.push('/configuracoes');
    setShowUserMenu(false);
  };
  
  return (
    <header className="h-16 bg-prospere-dark border-b border-prospere-gray-800 flex items-center justify-between px-4 lg:px-6 fixed top-0 right-0 left-0 lg:left-80 z-30">
      <div className="flex-1" />
      
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 text-prospere-gray-400 hover:text-white hover:bg-prospere-gray-900 rounded-lg transition-colors"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        
        {/* Language/Country */}
        <button className="p-2 text-prospere-gray-400 hover:text-white hover:bg-prospere-gray-900 rounded-lg transition-colors">
          <span className="text-lg">🇧🇷</span>
        </button>
        
        {/* Notifications */}
        <button className="p-2 text-prospere-gray-400 hover:text-white hover:bg-prospere-gray-900 rounded-lg transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-prospere-red rounded-full"></span>
        </button>
        
        {/* User Info */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 px-4 py-2 bg-prospere-gray-900 hover:bg-prospere-gray-800 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-prospere-red rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-white">{displayUser.email}</p>
              <p className="text-xs text-prospere-gray-500">{displayUser.name}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-prospere-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-64 bg-prospere-gray-900 border border-prospere-gray-800 rounded-lg shadow-xl py-2 z-50"
              >
                <div className="px-4 py-3 border-b border-prospere-gray-800">
                  <p className="text-sm font-medium text-white">{displayUser.name}</p>
                  <p className="text-xs text-prospere-gray-400">{displayUser.email}</p>
                </div>
                <button 
                  onClick={handleProfile}
                  className="w-full text-left px-4 py-2.5 text-sm text-prospere-gray-400 hover:bg-prospere-gray-800 hover:text-white transition-colors flex items-center gap-3"
                >
                  <UserCircle className="w-4 h-4" />
                  Perfil
                </button>
                <button 
                  onClick={handleSettings}
                  className="w-full text-left px-4 py-2.5 text-sm text-prospere-gray-400 hover:bg-prospere-gray-800 hover:text-white transition-colors flex items-center gap-3"
                >
                  <Settings className="w-4 h-4" />
                  Configurações
                </button>
                <div className="border-t border-prospere-gray-800 my-1" />
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors flex items-center gap-3"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* New Deposit Button */}
        {!isDepositPage && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/deposito')}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-prospere-gold hover:bg-yellow-600 text-prospere-black font-bold rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Depósito
          </motion.button>
        )}
      </div>
    </header>
  );
}
