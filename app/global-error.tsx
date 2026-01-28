'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="min-h-screen bg-prospere-black flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-prospere-gray-900 rounded-lg border border-prospere-gray-800 p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">
              Erro Crítico
            </h1>
            <p className="text-prospere-gray-400 mb-6">
              Ocorreu um erro crítico na aplicação.
            </p>
            <button
              onClick={reset}
              className="px-4 py-2 bg-prospere-red text-white rounded-lg hover:bg-prospere-red/90 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
