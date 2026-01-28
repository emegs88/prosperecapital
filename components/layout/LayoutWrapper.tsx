'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAberturaConta = pathname?.includes('/abertura-conta');
  
  if (isAberturaConta) {
    return <>{children}</>;
  }
  
  return (
    <div className="flex min-h-screen bg-prospere-black">
      <Sidebar />
      <div className="flex-1 lg:ml-80">
        <Header />
        <main className="mt-16 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
