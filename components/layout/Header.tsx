'use client';

import { Bell, User, Sun, Moon, ChevronDown, Plus, ArrowDownCircle } from 'lucide-react';
import { mockInvestor } from '@/lib/mockData';
import { getCurrentUser } from '@/lib/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const isDepositPage = pathname?.includes('/deposito');
  const currentUser = getCurrentUser();
  const displayUser = currentUser || mockInvestor;
  
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
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 px-4 py-2 bg-prospere-gray-900 hover:bg-prospere-gray-800 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-prospere-red rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-white">{displayUser.email}</p>
              <p className="text-xs text-prospere-gray-500">{'name' in displayUser ? displayUser.name : displayUser.email}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-prospere-gray-400" />
          </button>
          
          {showUserMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-2 w-64 bg-prospere-gray-900 border border-prospere-gray-800 rounded-lg shadow-lg py-2"
            >
              <div className="px-4 py-2 border-b border-prospere-gray-800">
                <p className="text-sm font-medium text-white">{'name' in displayUser ? displayUser.name : displayUser.email}</p>
                <p className="text-xs text-prospere-gray-400">{displayUser.email}</p>
              </div>
              <button className="w-full text-left px-4 py-2 text-sm text-prospere-gray-400 hover:bg-prospere-gray-800 hover:text-white">
                Perfil
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-prospere-gray-400 hover:bg-prospere-gray-800 hover:text-white">
                Configurações
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-prospere-gray-400 hover:bg-prospere-gray-800 hover:text-white">
                Sair
              </button>
            </motion.div>
          )}
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
