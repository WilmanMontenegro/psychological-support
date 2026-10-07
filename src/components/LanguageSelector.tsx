'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages: string;
            layout: number;
            autoDisplay?: boolean;
          },
          elementId: string
        ) => void;
      };
    };
    googleTranslateElementInit: () => void;
  }
}

type Lang = 'es' | 'en';

function readLangFromCookie(): Lang | null {
  const match = document.cookie.match(/(?:^|;\s*)googtrans=\/[^/]+\/([^;]+)/);
  const code = match?.[1];
  if (code === 'en') return 'en';
  if (code === 'es' || code === 'auto') return 'es';
  return null;
}

function clearGoogTransCookies() {
  const hostname = window.location.hostname;
  const expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
  const paths = ['/', window.location.pathname];
  const domains = ['', hostname, `.${hostname}`];

  for (const path of paths) {
    for (const domain of domains) {
      const domainPart = domain ? `; domain=${domain}` : '';
      document.cookie = `googtrans=; expires=${expires}; path=${path}${domainPart}`;
    }
  }
}

function triggerSelectChange(select: HTMLSelectElement) {
  select.dispatchEvent(new Event('change', { bubbles: true }));
}

function getTranslateSelect() {
  return document.querySelector<HTMLSelectElement>(
    '#google_translate_element select.goog-te-combo, select.goog-te-combo'
  );
}

function labelGoogleSelect(select: HTMLSelectElement) {
  if (!select.id) select.id = 'google-translate-lang';
  if (!select.name) select.name = 'google-translate-lang';
  if (!select.getAttribute('autocomplete')) {
    select.setAttribute('autocomplete', 'off');
  }
}

export default function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState<Lang>('es');
  const applyingRef = useRef(false);

  useEffect(() => {
    const cookieLang = readLangFromCookie();
    if (cookieLang) setCurrentLang(cookieLang);

    const initWidget = () => {
      const host = document.getElementById('google_translate_element');
      if (!host || !window.google?.translate?.TranslateElement) return;

      if (!getTranslateSelect()) {
        host.replaceChildren();
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'es',
            includedLanguages: 'es,en',
            layout: 0,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }

      const select = getTranslateSelect();
      if (select) labelGoogleSelect(select);

      const mo = new MutationObserver(() => {
        const ready = getTranslateSelect();
        if (ready) {
          labelGoogleSelect(ready);
          mo.disconnect();
        }
      });
      mo.observe(host, { childList: true, subtree: true });
    };

    window.googleTranslateElementInit = initWidget;

    const existing = document.getElementById('google-translate-script');
    if (window.google?.translate?.TranslateElement) {
      initWidget();
      return;
    }

    if (!existing) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src =
        '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
      return;
    }

    const timer = window.setInterval(() => {
      if (window.google?.translate?.TranslateElement) {
        window.clearInterval(timer);
        initWidget();
      }
    }, 200);
    return () => window.clearInterval(timer);
  }, []);

  const applyLanguage = (lang: Lang, attemptsLeft = 20) => {
    if (applyingRef.current && attemptsLeft === 20) return;
    applyingRef.current = true;

    const select = getTranslateSelect();
    if (!select || select.options.length < 2) {
      if (attemptsLeft > 0) {
        window.setTimeout(() => applyLanguage(lang, attemptsLeft - 1), 150);
      } else {
        applyingRef.current = false;
      }
      return;
    }

    // Volver al español (idioma original): cookie + value vacío + doble change.
    if (lang === 'es') {
      clearGoogTransCookies();
      select.value = '';
      triggerSelectChange(select);
      window.setTimeout(() => {
        select.value = '';
        triggerSelectChange(select);
        // Si el widget no restaura, forzar recarga limpia.
        const stillEn =
          select.value === 'en' ||
          document.cookie.includes('/en') ||
          document.documentElement.className.includes('translated');
        if (stillEn) {
          clearGoogTransCookies();
          window.location.reload();
          return;
        }
        setCurrentLang('es');
        applyingRef.current = false;
      }, 120);
      return;
    }

    const hasEn = [...select.options].some((opt) => opt.value === 'en');
    if (!hasEn) {
      if (attemptsLeft > 0) {
        window.setTimeout(() => applyLanguage(lang, attemptsLeft - 1), 150);
      } else {
        applyingRef.current = false;
      }
      return;
    }

    select.value = 'en';
    triggerSelectChange(select);
    setCurrentLang('en');
    applyingRef.current = false;
  };

  const handleToggleLanguage = () => {
    const newLang: Lang = currentLang === 'es' ? 'en' : 'es';
    applyLanguage(newLang);
  };

  return (
    <div className="relative ml-4 sm:ml-3 notranslate" translate="no">
      <button
        type="button"
        onClick={handleToggleLanguage}
        className="flex items-center justify-center gap-0.5 px-1.5 py-1 rounded-md hover:bg-secondary/10 transition-all duration-200 border border-gray-200 hover:border-secondary/30 active:scale-95"
        aria-label={
          currentLang === 'es' ? 'Cambiar idioma a inglés' : 'Cambiar idioma a español'
        }
        title={currentLang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
      >
        <Image
          src={currentLang === 'es' ? '/images/flags/es.svg' : '/images/flags/en.svg'}
          alt={currentLang === 'es' ? 'Bandera de España' : 'Bandera de Estados Unidos'}
          width={18}
          height={12}
          className="rounded-[2px]"
        />
        <span className="text-xs font-semibold text-gray-700">
          {currentLang === 'es' ? 'ES' : 'EN'}
        </span>
      </button>

      {/* Fuera de pantalla (no display:none): si está oculto, en móvil a veces no nace .goog-te-combo */}
      <div
        id="google_translate_element"
        className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0"
        aria-hidden="true"
      />
    </div>
  );
}
