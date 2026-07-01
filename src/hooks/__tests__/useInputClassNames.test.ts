import { useInputClassNames } from '../useInputClassNames';

describe('useInputClassNames', () => {
  it('includes base layout and focus classes in all outputs', () => {
    const result = useInputClassNames({});
    expect(result).toContain('w-full');
    expect(result).toContain('rounded-xl');
    expect(result).toContain('focus:outline-none');
    expect(result).toContain('focus:ring-2');
    expect(result).toContain('disabled:bg-gray-50');
  });

  it('applies normal border classes when hasError is false', () => {
    const result = useInputClassNames({ hasError: false });
    expect(result).toContain('border-gray-300');
    expect(result).toContain('focus:border-brand-700');
    expect(result).toContain('focus:ring-brand-200');
  });

  it('applies error border classes when hasError is true', () => {
    const result = useInputClassNames({ hasError: true });
    expect(result).toContain('border-red-400');
    expect(result).toContain('focus:border-red-500');
    expect(result).toContain('focus:ring-red-300');
  });

  it('does not apply error classes when hasError is false', () => {
    const result = useInputClassNames({ hasError: false });
    expect(result).not.toContain('border-red-400');
    expect(result).not.toContain('focus:ring-red-300');
  });

  it('does not apply normal border classes when hasError is true', () => {
    const result = useInputClassNames({ hasError: true });
    expect(result).not.toContain('border-gray-300');
    expect(result).not.toContain('focus:ring-brand-200');
  });

  it('includes extra classes when provided', () => {
    const result = useInputClassNames({ extra: 'appearance-none cursor-pointer' });
    expect(result).toContain('appearance-none');
    expect(result).toContain('cursor-pointer');
  });

  it('includes className override when provided', () => {
    const result = useInputClassNames({ className: 'pl-7' });
    expect(result).toContain('pl-7');
  });

  it('defaults hasError to false when omitted', () => {
    const result = useInputClassNames({});
    expect(result).toContain('border-gray-300');
    expect(result).not.toContain('border-red-400');
  });
});
