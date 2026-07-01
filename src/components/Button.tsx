import { ButtonHTMLAttributes } from 'react'

export type ButtonVariant = 'primary' | 'danger' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-800 text-white hover:bg-brand-900 focus-visible:ring-brand-700 disabled:bg-brand-800/40',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 disabled:bg-red-600/40',
  ghost:
    'bg-transparent text-brand-800 border border-brand-800 hover:bg-brand-50 focus-visible:ring-brand-700 disabled:opacity-40',
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={[
        'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold',
        'transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed',
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}
