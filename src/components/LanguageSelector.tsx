'use client';

import { useEffect, useState } from 'react';
import { FaGlobe } from 'react-icons/fa6';

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
  const [isOpen, setIsOpen] = useState(false);
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
          layout: 0, // Layout más simple
        },
        'google_translate_element'
      );
    };

    addScript();
  }, []);

  const handleLanguageChange = (lang: 'es' | 'en') => {
    setCurrentLang(lang);
    setIsOpen(false);

    // Buscar el selector de Google Translate y cambiar idioma
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event('change'));
    }
  };

  return (
    <div className="relative">
      {/* Botón principal - Diseño minimalista que combina con el header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-secondary/10 transition-colors"
        aria-label="Cambiar idioma"
      >
        <FaGlobe className="text-secondary" size={16} />
        <span className="text-xs sm:text-sm font-medium text-gray-700">
          {currentLang === 'es' ? 'ES' : 'EN'}
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Overlay para cerrar al hacer clic fuera */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menú - Responsive y alineado correctamente */}
          <div className="absolute right-0 mt-2 w-36 sm:w-40 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
            <button
              onClick={() => handleLanguageChange('es')}
              className={`w-full px-3 sm:px-4 py-2 text-left hover:bg-secondary/10 transition-colors flex items-center gap-2 sm:gap-3 ${
                currentLang === 'es' ? 'bg-secondary/5 text-secondary font-semibold' : 'text-gray-700'
              }`}
            >
              <span className="text-base sm:text-lg">🇪🇸</span>
              <span className="text-xs sm:text-sm">Español</span>
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`w-full px-3 sm:px-4 py-2 text-left hover:bg-secondary/10 transition-colors flex items-center gap-2 sm:gap-3 ${
                currentLang === 'en' ? 'bg-secondary/5 text-secondary font-semibold' : 'text-gray-700'
              }`}
            >
              <span className="text-base sm:text-lg">🇺🇸</span>
              <span className="text-xs sm:text-sm">English</span>
            </button>
          </div>
        </>
      )}

      {/* Elemento oculto de Google Translate */}
      <div id="google_translate_element" className="hidden" />
    </div>
  );
}
