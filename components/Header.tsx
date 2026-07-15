'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingCart, Menu, Search, X, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { LanguageSelector } from './LanguageSelector';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';

export const Header: React.FC = () => {
  const { itemCount, setIsCartOpen } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fechar menu do usuário ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showUserMenu && !(e.target as Element).closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [showUserMenu]);

  // Adicionar blur no conteúdo quando menu mobile estiver aberto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'HOME', path: '/' },
    //{ name: 'BANDAS', path: '/bandas' },
    { name: 'PRODUZIR MATERIAL', path: '/produzir-material' },
    { name: 'INVOCAÇÕES FUTURAS', path: '/releases' },
    { name: 'SOBRE', path: '/about' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 transition-all duration-500 flex items-center justify-between px-6 md:px-12 ${
      isScrolled || isMobileMenuOpen ? 'h-20 glass-heavy border-b border-red-900/30' : 'h-28 bg-transparent'
    } z-40`}>
      <div className="flex items-center gap-12">
        <Link href="/" className={`transition-all duration-500 transform ${isScrolled ? 'scale-75' : 'scale-100'}`}>
          <Logo size="sm" />
        </Link>
        
        <nav className="hidden xl:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path}
              className={`text-[11px] font-black tracking-[0.3em] transition-all hover:text-white relative group ${
                pathname === link.path ? 'text-red-600' : 'text-zinc-500'
              }`}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 h-[1px] bg-red-600 transition-all duration-500 ${
                pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center language-selector-wrapper">
          <LanguageSelector />
        </div>
        
        <button className="p-2 text-zinc-500 hover:text-white transition-colors">
          <Search size={18} />
        </button>

        <button onClick={() => setIsCartOpen(true)} className="relative p-2 group">
          <ShoppingCart size={20} className="text-zinc-400 group-hover:text-red-500 transition-colors" />
          {itemCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-600 text-[9px] font-black text-white w-4 h-4 flex items-center justify-center rounded-full shadow-lg shadow-red-900/50">
              {itemCount}
            </span>
          )}
        </button>

        {isAuthenticated && user ? (
          <div className="hidden lg:block relative user-menu-container">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-4 py-2 border border-zinc-800 hover:border-red-600 hover:bg-red-900/5 transition-all"
            >
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name || user.email}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center">
                  <User size={14} className="text-white" />
                </div>
              )}
              <span className="text-[10px] font-black tracking-widest uppercase text-zinc-400">
                {user.name || user.email.split('@')[0]}
              </span>
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 bg-zinc-950 border border-zinc-900 rounded-sm min-w-[200px] shadow-xl">
                <div className="p-4 border-b border-zinc-900">
                  <p className="text-[11px] font-mono text-white font-bold">{user.name || 'Usuário'}</p>
                  <p className="text-[9px] font-mono text-zinc-500">{user.email}</p>
                </div>
                <button
                  onClick={async () => {
                    await logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-[10px] font-black tracking-widest text-zinc-400 hover:text-red-600 hover:bg-red-900/5 transition-all uppercase flex items-center gap-2"
                >
                  <LogOut size={14} /> Sair
                </button>
              </div>
            )}
          </div>
        ) : (
          // Botão de login comentado - será utilizado na navbar depois
          // <Link href="/login" className="hidden lg:block text-[10px] font-black tracking-widest border border-zinc-800 px-5 py-2 hover:border-red-600 hover:bg-red-900/5 transition-all uppercase">
          //   Login
          // </Link>
          null
        )}

        <button 
          className="xl:hidden text-red-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay com blur para o conteúdo */}
          <div className="fixed inset-0 top-0 bg-black/60 backdrop-blur-md z-40 xl:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
          
          {/* Menu mobile */}
          <div className="fixed inset-0 top-0 bg-black/98 backdrop-blur-sm z-50 p-10 flex flex-col gap-8 xl:hidden animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex justify-between items-center mb-8">
               <Logo size="sm" />
               <button onClick={() => setIsMobileMenuOpen(false)}><X size={32} className="text-red-600" /></button>
            </div>
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-4xl font-metal tracking-widest text-zinc-200 hover:text-red-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </>
      )}
    </header>
  );
};
