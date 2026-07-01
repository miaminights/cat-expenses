import { render, screen } from '@testing-library/react';
import { Input } from '../Input';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input placeholder="Type here" />);
    expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
  });

  it('applies error border classes when hasError is true', () => {
    render(<Input hasError placeholder="err" />);
    expect(screen.getByPlaceholderText('err')).toHaveClass('border-red-400');
  });

  it('applies normal border classes when hasError is false', () => {
    render(<Input hasError={false} placeholder="ok" />);
    const input = screen.getByPlaceholderText('ok');
    expect(input).toHaveClass('border-gray-300');
    expect(input).not.toHaveClass('border-red-400');
  });

  it('forwards additional props to the underlying input', () => {
    render(<Input type="number" aria-label="Amount" />);
    const input = screen.getByRole('spinbutton', { name: 'Amount' });
    expect(input).toHaveAttribute('type', 'number');
  });
});
