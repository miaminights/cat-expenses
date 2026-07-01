import { useEffect } from 'react';
import type { ReactNode, Ref } from 'react';
import { AutoFocus } from './AutoFocus';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  titleId?: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, subtitle, titleId = 'modal-title', children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <AutoFocus>
        {(ref) => (
          <div
            ref={ref as Ref<HTMLDivElement>}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl focus:outline-none"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div {...(subtitle ? { 'aria-label': `${title}, ${subtitle}` } : {})}>
                <h2 id={titleId} className="text-lg font-semibold text-gray-900">
                  {title}
                </h2>
                {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close modal"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
            {children}
          </div>
        )}
      </AutoFocus>
    </div>
  );
}
