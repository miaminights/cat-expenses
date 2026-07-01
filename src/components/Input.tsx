import type { InputHTMLAttributes } from 'react';

import { useInputClassNames } from '../hooks/useInputClassNames';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export function Input({ hasError = false, className, ...props }: InputProps) {
  const classnames = useInputClassNames({
    hasError,
    className,
    extra: 'placeholder:text-gray-400',
  });

  return <input {...props} className={classnames} />;
}
