import type { ReactNode, RefObject } from 'react';
import { useEffect, useRef } from 'react';

export function AutoFocus({ children }: { children: (ref: RefObject<HTMLElement | null>) => ReactNode }) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return <>{children(ref)}</>;
}
