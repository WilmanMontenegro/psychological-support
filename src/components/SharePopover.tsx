'use client';

import { useState, useRef, useEffect } from 'react';
import { FaShare } from 'react-icons/fa6';
import ShareButtons from './ShareButtons';

interface SharePopoverProps {
  title: string;
}

export default function SharePopover({ title }: SharePopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);


  // Close when clicking outside
  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
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



  return (
    <div className="relative inline-block" ref={popoverRef}>
      {/* Trigger Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all duration-300 text-sm ${isOpen
          ? 'bg-secondary text-white shadow-md'
          : 'text-gray-600 hover:text-secondary hover:bg-secondary/5'
          }`}
        aria-label="Compartir"
        title="Compartir"
      >
        <FaShare className={isOpen ? "text-white" : "text-secondary"} />
        <span className="font-medium">Compartir</span>
      </button>

      {/* Popover Content */}
      <div
        className={`absolute top-full right-0 mt-2 z-50 bg-white rounded-xl shadow-xl border border-gray-100 p-3 min-w-[220px] transform transition-all duration-200 origin-top-right ${isOpen
          ? 'opacity-100 scale-100 translate-y-0'
          : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }`}
      >
        <div className="flex flex-col gap-2">
          <p className="text-xs text-gray-400 text-center font-medium mb-1">Compartir en:</p>
          <ShareButtons title={title} variant="social-only" />
        </div>

        {/* Little arrow/triangle */}
        <div className="absolute -top-1.5 right-3 w-3 h-3 bg-white border-t border-l border-gray-100 transform rotate-45"></div>
      </div>
    </div>
  );
}
