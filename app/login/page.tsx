'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { Logo } from '@/components/Logo';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginContent() {
  const { login, loginWithGoogle, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Verificar se já está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Verificar erros na URL (do callback do Google)
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      setErrors({ general: 'Erro ao autenticar com Google. Tente novamente.' });
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await login({ email: formData.email, password: formData.password }, formData.rememberMe);
      router.push('/');
    } catch (error: any) {
      setErrors({
        general: error.message || 'Erro ao fazer login. Verifique suas credenciais.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  return (
    <div className="bg-black min-h-screen pt-32 pb-40 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-12 space-y-6">
          <div className="flex justify-center">
            <Logo size="md" />
          </div>
          <div className="flex items-center justify-center gap-4 text-red-600 font-mono text-[10px] font-black tracking-[0.4em] uppercase">
            <span className="h-[1px] w-12 bg-red-900/50"></span>
            SANCTUARY LOGIN
            <span className="h-[1px] w-12 bg-red-900/50"></span>
          </div>
          <h1 className="text-4xl font-metal text-white tracking-widest uppercase">
            ACESSO AO RITUAL
          </h1>
        </div>

        {/* Formulário */}
        <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-sm">
          {errors.general && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-900/50 rounded-sm flex items-center gap-3">
              <AlertCircle className="text-red-600" size={18} />
              <p className="text-[11px] font-mono text-red-600">{errors.general}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 tracking-widest uppercase flex items-center gap-2">
                <Mail size={14} /> Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="MORTE@METAL.COM"
                className={`w-full bg-black border ${
                  errors.email ? 'border-red-600' : 'border-zinc-800'
                } p-4 font-mono text-sm text-white focus:border-red-600 outline-none transition-all`}
              />
              {errors.email && (
                <p className="text-[10px] font-mono text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 tracking-widest uppercase flex items-center gap-2">
                <Lock size={14} /> Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`w-full bg-black border ${
                    errors.password ? 'border-red-600' : 'border-zinc-800'
                  } p-4 font-mono text-sm text-white focus:border-red-600 outline-none transition-all pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] font-mono text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Lembrar-me e Esqueci a senha */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 bg-black border border-zinc-800 checked:bg-red-600 checked:border-red-600 focus:ring-red-600 focus:ring-offset-0 focus:ring-2 focus:ring-offset-black"
                />
                <span className="text-[10px] font-mono text-zinc-500 group-hover:text-zinc-400 transition-colors">
                  Lembrar-me
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-[10px] font-mono text-zinc-500 hover:text-red-600 transition-colors"
              >
                Esqueci a senha
              </Link>
            </div>

            {/* Botão Login */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-red-600 text-white font-black tracking-[0.3em] text-[11px] flex items-center justify-center gap-3 hover:bg-red-500 transition-all uppercase shadow-2xl shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  AUTENTICANDO...
                </>
              ) : (
                <>
                  <LogIn size={16} /> ENTRAR
                </>
              )}
            </button>
          </form>

          {/* Divisor */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-[1px] bg-zinc-900"></div>
            <span className="text-[10px] font-mono text-zinc-600 uppercase">ou</span>
            <div className="flex-1 h-[1px] bg-zinc-900"></div>
          </div>

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full py-4 border border-zinc-800 text-zinc-300 font-black tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 hover:border-red-600 hover:text-red-600 transition-all uppercase bg-black"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            ENTRAR COM GOOGLE
          </button>

          {/* Link para Registro */}
          <div className="mt-8 text-center">
            <p className="text-[10px] font-mono text-zinc-500">
              Não tem uma conta?{' '}
              <Link href="/register" className="text-red-600 hover:text-red-500 transition-colors">
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
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
      <LoginContent />
    </Suspense>
  );
}

