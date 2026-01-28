'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-prospere-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-prospere-gray-900 rounded-lg border border-prospere-gray-800 p-8 text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="w-16 h-16 text-prospere-red" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Algo deu errado!
        </h1>
        <p className="text-prospere-gray-400 mb-6">
          Ocorreu um erro inesperado. Por favor, tente novamente.
        </p>
        {error.message && (
          <div className="mb-6 p-3 bg-prospere-gray-800 rounded border border-prospere-gray-700">
            <p className="text-xs text-prospere-gray-500 mb-1">Detalhes do erro:</p>
            <p className="text-sm text-prospere-red">{error.message}</p>
          </div>
        )}
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Tentar Novamente
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
          >
            Voltar ao Início
          </Button>
        </div>
      </div>
    </div>
  );
}
