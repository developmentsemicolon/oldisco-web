'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

// Função auxiliar para acionar tradução via API do Google Translate (último recurso)
const triggerGoogleTranslate = (targetLangCode: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    // Atualizar cookie
    const pageLang = 'pt';
    document.cookie = `googtrans=/pt/${targetLangCode}; path=/; max-age=31536000`;
    
    // Se for português (idioma original), remover tradução
    if (targetLangCode === 'pt') {
      // Remover cookie de tradução
      document.cookie = 'googtrans=; path=/; max-age=0';
      // Recarregar para voltar ao idioma original
      window.location.reload();
      return true;
    }
    
    // Para outros idiomas, recarregar a página para aplicar a tradução
    // O Google Translate lê o cookie na inicialização
    window.location.reload();
    return true;
  } catch (error) {
    console.error('Erro ao acionar Google Translate via API:', error);
    return false;
  }
};

// Função auxiliar para mapear códigos do Google Translate para códigos do componente
const getGoogleTranslateLanguage = (): string | null => {
  if (typeof window === 'undefined') return null;

  // Tentar ler do select do Google Translate primeiro
  const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
  if (select && select.value) {
    // O valor do select pode ser como "pt", "en", "zh-CN", etc.
    const value = select.value;
    
    // Mapear valores do Google Translate para códigos do componente
    // O Google Translate pode usar formatos diferentes, então tentamos vários
    if (value === 'pt' || value.startsWith('pt|')) return 'pt';
    if (value === 'en' || value.startsWith('en|')) return 'en';
    if (value === 'es' || value.startsWith('es|')) return 'es';
    if (value === 'fr' || value.startsWith('fr|')) return 'fr';
    if (value === 'de' || value.startsWith('de|')) return 'de';
    if (value === 'it' || value.startsWith('it|')) return 'it';
    if (value === 'ja' || value.startsWith('ja|')) return 'ja';
    if (value === 'ko' || value.startsWith('ko|')) return 'ko';
    if (value === 'zh-CN' || value === 'zh' || value.startsWith('zh')) return 'zh-CN';
    if (value === 'ru' || value.startsWith('ru|')) return 'ru';
    if (value === 'ar' || value.startsWith('ar|')) return 'ar';
    
    // Se não mapeou, retornar o valor original
    return value;
  }

  // Fallback: ler do cookie googtrans
  const cookies = document.cookie.split(';');
  const googtransCookie = cookies.find(cookie => cookie.trim().startsWith('googtrans='));
  
  if (googtransCookie) {
    // O formato do cookie é: googtrans=/pt/en ou googtrans=/pt/pt (quando não traduzido)
    const value = googtransCookie.split('=')[1];
    if (value) {
      // Extrair o código do idioma de destino (segunda parte após a barra)
      const parts = value.split('/');
      if (parts.length >= 3) {
        const targetLang = parts[2]; // Ex: /pt/en -> "en"
        
        // Mapear para códigos do componente
        if (targetLang === 'pt') return 'pt';
        if (targetLang === 'en') return 'en';
        if (targetLang === 'es') return 'es';
        if (targetLang === 'fr') return 'fr';
        if (targetLang === 'de') return 'de';
        if (targetLang === 'it') return 'it';
        if (targetLang === 'ja') return 'ja';
        if (targetLang === 'ko') return 'ko';
        if (targetLang === 'zh-CN' || targetLang === 'zh') return 'zh-CN';
        if (targetLang === 'ru') return 'ru';
        if (targetLang === 'ar') return 'ar';
      }
    }
  }

  return null;
};

export const LanguageSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Detectar idioma atual do Google Translate
  const detectCurrentLanguage = useCallback(() => {
    const detectedCode = getGoogleTranslateLanguage();

    if (detectedCode) {
      const lang = languages.find(l => l.code === detectedCode);
      if (lang) {
        setCurrentLanguage(lang);
        return;
      }
    }
    
    // Se não detectou ou não encontrou, usar português como padrão
    setCurrentLanguage(languages[0]);
  }, []);

  useEffect(() => {
    // Aguardar o Google Translate carregar e detectar idioma inicial
    const checkGoogleTranslate = setInterval(() => {
      if (typeof window !== 'undefined' && (window as any).google?.translate) {
        // Aguardar um pouco mais para o select ser criado
        setTimeout(() => {
          detectCurrentLanguage();
        }, 200);
        clearInterval(checkGoogleTranslate);
      }
    }, 100);

    // Detectar imediatamente se já estiver disponível
    detectCurrentLanguage();

    return () => clearInterval(checkGoogleTranslate);
  }, [detectCurrentLanguage]);

  // Listener para mudanças no select do Google Translate
  useEffect(() => {
    let cleanup: (() => void) | null = null;
    let cookieCheckInterval: NodeJS.Timeout | null = null;

    // Aguardar o select ser criado
    const waitForSelect = setInterval(() => {
      const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      if (select) {
        clearInterval(waitForSelect);
        
        // Escutar mudanças no select
        const handleTranslateChange = () => {
          detectCurrentLanguage();
        };
        
        select.addEventListener('change', handleTranslateChange);
        
        // Também escutar mudanças no cookie (usando polling)
        // O Google Translate atualiza o cookie quando muda o idioma
        let lastCookie = document.cookie;
        cookieCheckInterval = setInterval(() => {
          if (document.cookie !== lastCookie) {
            lastCookie = document.cookie;
            detectCurrentLanguage();
          }
        }, 500);

        cleanup = () => {
          select.removeEventListener('change', handleTranslateChange);
          if (cookieCheckInterval) {
            clearInterval(cookieCheckInterval);
          }
        };
      }
    }, 100);

    return () => {
      clearInterval(waitForSelect);
      if (cleanup) {
        cleanup();
      }
    };
  }, [detectCurrentLanguage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const changeLanguage = useCallback((language: Language) => {
    if (typeof window === 'undefined') {
      setIsOpen(false);
      return;
    }

    setIsOpen(false);

    // Atualizar estado visual imediatamente para feedback do usuário
    setCurrentLanguage(language);

    // Determinar o idioma de destino
    const pageLang = 'pt';
    const targetLang = language.code === 'zh-CN' ? 'zh-CN' : language.code;

    // Se for português (idioma original), remover cookie de tradução
    if (targetLang === 'pt') {
      document.cookie = 'googtrans=; path=/; max-age=0';
      // Recarregar para voltar ao idioma original
      window.location.reload();
      return;
    }

    // Para outros idiomas, atualizar cookie e recarregar imediatamente
    // O Google Translate precisa recarregar a página para ler o cookie na inicialização
    document.cookie = `googtrans=/pt/${targetLang}; path=/; max-age=31536000`;
    window.location.reload();
  }, []);

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border border-zinc-800 hover:border-red-600 hover:bg-red-900/5 transition-all text-zinc-400 hover:text-white min-w-[60px]"
        aria-label="Selecionar idioma"
      >
        <span className="text-lg leading-none flex-shrink-0">{currentLanguage.flag}</span>
        <span className="hidden sm:inline text-[10px] font-black tracking-widest uppercase whitespace-nowrap">
          {currentLanguage.code.toUpperCase()}
        </span>
        <ChevronDown 
          size={14} 
          className={`transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-zinc-950 border border-zinc-900 rounded-sm min-w-[200px] shadow-xl z-50 max-h-[400px] overflow-y-auto">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => changeLanguage(language)}
              className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-red-900/10 transition-all ${
                currentLanguage.code === language.code
                  ? 'bg-red-900/20 text-red-600 border-l-2 border-red-600'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span className="text-xl leading-none">{language.flag}</span>
              <div className="flex flex-col">
                <span className="text-[11px] font-black tracking-wider uppercase">
                  {language.name}
                </span>
                <span className="text-[9px] font-mono text-zinc-600 uppercase">
                  {language.code}
                </span>
              </div>
              {currentLanguage.code === language.code && (
                <span className="ml-auto text-red-600 text-xs">✓</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Elemento oculto do Google Translate para manter funcionalidade */}
      <div id="google_translate_element" className="hidden"></div>
    </div>
  );
};

