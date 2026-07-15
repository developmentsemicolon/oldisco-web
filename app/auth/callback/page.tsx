'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Logo } from '@/components/Logo';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Pegar dados da URL (backend envia como query params individuais)
        const token = searchParams.get('token');
        const id = searchParams.get('id');
        const email = searchParams.get('email');
        const name = searchParams.get('name');
        const avatar = searchParams.get('avatar');
        const role = searchParams.get('role');

        // Verificar se há erro na URL
        const error = searchParams.get('error');
        if (error) {
          throw new Error('Erro na autenticação com Google');
        }

        if (token && id && email) {
          // Criar objeto de resposta de autenticação
          const authResponse = {
            token,
            user: {
              id,
              email,
              name: name || null,
              avatar: avatar || null,
              role: role || 'USER',
            },
          };

          // Salvar no localStorage (usar localStorage por padrão para OAuth)
          localStorage.setItem('auth_token', token);
          localStorage.setItem('auth_user', JSON.stringify(authResponse.user));
          localStorage.setItem('auth_remember_me', 'true');

          // Verificar autenticação
          await checkAuth();

          // Redirecionar para dashboard
          router.push('/dashboard');
        } else {
          throw new Error('Dados de autenticação incompletos');
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || 'Erro ao processar autenticação');
        setIsLoading(false);
        
        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          router.push('/login?error=auth_failed');
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, checkAuth, router]);

  return (
    <div className="bg-black min-h-screen pt-32 pb-40 flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center space-y-8">
        <Logo size="md" />
        <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-sm">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              <h2 className="text-xl font-metal text-white tracking-widest">AUTENTICANDO...</h2>
              <p className="text-zinc-500 font-mono text-sm">Processando login com Google</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-metal text-red-600 tracking-widest">ERRO</h2>
              <p className="text-zinc-400 font-mono text-sm">{error}</p>
              <p className="text-zinc-600 font-mono text-xs">Redirecionando para login...</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="bg-black min-h-screen pt-32 pb-40 flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center space-y-8">
          <Logo size="md" />
          <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-sm">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              <h2 className="text-xl font-metal text-white tracking-widest">CARREGANDO...</h2>
            </div>
          </div>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}

