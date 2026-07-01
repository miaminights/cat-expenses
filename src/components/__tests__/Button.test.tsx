import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('applies primary variant classes by default', () => {
    render(<Button>Primary</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('bg-brand-800', 'text-white');
  });

  it('applies danger variant classes', () => {
    render(<Button variant="danger">Delete</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-red-600', 'text-white');
  });

  it('applies ghost variant classes', () => {
    render(<Button variant="ghost">Cancel</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('bg-transparent', 'border');
  });

  it('is disabled when the disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('merges additional className values', () => {
    render(<Button className="w-full">Wide</Button>);
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });

  it('forwards additional HTML button attributes', () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});
