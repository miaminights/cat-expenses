import { clsx } from 'clsx';

export function useInputClassNames({
  hasError = false,
  className,
  extra,
}: {
  hasError?: boolean;
  className?: string;
  extra?: string;
}) {
  return clsx(
    'w-full px-3.5 py-2.5 rounded-xl text-sm text-gray-900 bg-white',
    'border transition-colors duration-150',
    'focus:outline-none focus:ring-2 focus:ring-offset-0',
    'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-red-300'
      : 'border-gray-300 focus:border-brand-700 focus:ring-brand-200',
    extra,
    className,
  );
}
