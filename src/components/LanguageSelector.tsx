'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages: string;
            layout: number;
          },
          elementId: string
        ) => void;
      };
    };
    googleTranslateElementInit: () => void;
  }
}

export default function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState<'es' | 'en'>('es');

  useEffect(() => {
    // Cargar script de Google Translate
    const addScript = () => {
      if (document.getElementById('google-translate-script')) return;

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    };

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'es',
          includedLanguages: 'es,en',
          layout: 0,
        },
        'google_translate_element'
      );
    };

    addScript();
  }, []);

  const handleToggleLanguage = () => {
    const newLang = currentLang === 'es' ? 'en' : 'es';
    setCurrentLang(newLang);

    // Buscar el selector de Google Translate y cambiar idioma
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = newLang;
      select.dispatchEvent(new Event('change'));
    }
  };

  return (
    <div className="relative">
      {/* Botón toggle - Diseño profesional y responsive */}
      <button
        onClick={handleToggleLanguage}
        className="flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2.5 sm:py-2 rounded-lg hover:bg-secondary/10 transition-all duration-200 border border-gray-200 hover:border-secondary/30 active:scale-95"
        aria-label="Cambiar idioma"
        title={currentLang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
      >
        {/* Bandera con tamaño responsive */}
        <span className="text-base sm:text-lg leading-none">
          {currentLang === 'es' ? '🇪🇸' : '🇺🇸'}
        </span>
        
        {/* Texto del idioma */}
        <span className="text-xs sm:text-sm font-semibold text-gray-700 min-w-7 sm:min-w-8 text-center">
          {currentLang === 'es' ? 'ES' : 'EN'}
        </span>
      </button>

      {/* Elemento oculto de Google Translate */}
      <div id="google_translate_element" className="hidden" />
    </div>
  );
}
