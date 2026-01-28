import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-prospere-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-prospere-gray-900 rounded-lg border border-prospere-gray-800 p-8 text-center">
        <h1 className="text-6xl font-bold text-prospere-red mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-2">
          Página não encontrada
        </h2>
        <p className="text-prospere-gray-400 mb-6">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/">
            <Button className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Ir para Home
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );
}
