import { SelectHTMLAttributes } from 'react';
import { useInputClassNames } from '../hooks/useInputClassNames';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export function Select({ hasError = false, className, children, ...props }: SelectProps) {
  const classnames = useInputClassNames({
    hasError,
    className,
    extra: "appearance-none cursor-pointer",
  });

  return (
    <select
      {...props}
      className={classnames}
    >
      {children}
    </select>
  );
}
