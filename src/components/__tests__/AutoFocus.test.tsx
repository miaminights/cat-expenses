import { render, screen } from '@testing-library/react';
import type { Ref } from 'react';
import { AutoFocus } from '../AutoFocus';

describe('AutoFocus', () => {
  it('renders the child element', () => {
    render(<AutoFocus>{(ref) => <button ref={ref as Ref<HTMLButtonElement>}>Click me</button>}</AutoFocus>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('focuses the element after mount', () => {
    render(<AutoFocus>{(ref) => <button ref={ref as Ref<HTMLButtonElement>}>Focused</button>}</AutoFocus>);
    expect(screen.getByRole('button', { name: 'Focused' })).toHaveFocus();
  });

  it('works with input elements', () => {
    render(<AutoFocus>{(ref) => <input ref={ref as Ref<HTMLInputElement>} placeholder="Name" />}</AutoFocus>);
    expect(screen.getByPlaceholderText('Name')).toHaveFocus();
  });

  it('does not throw when ref is not attached to any element', () => {
    expect(() => render(<AutoFocus>{() => <span>No ref</span>}</AutoFocus>)).not.toThrow();
  });

  it('only focuses the element that received the ref, not siblings', () => {
    render(
      <div>
        <AutoFocus>{(ref) => <button ref={ref as Ref<HTMLButtonElement>}>Target</button>}</AutoFocus>
        <button>Other</button>
      </div>,
    );
    expect(screen.getByRole('button', { name: 'Target' })).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Other' })).not.toHaveFocus();
  });
});
