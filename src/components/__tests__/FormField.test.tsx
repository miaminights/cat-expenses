import { render, screen } from '@testing-library/react';
import { FormField } from '../FormField';

describe('FormField', () => {
  it('renders the label text', () => {
    render(
      <FormField label="Item Name">
        <input />
      </FormField>,
    );
    expect(screen.getByText('Item Name')).toBeInTheDocument();
  });

  it('renders its children', () => {
    render(
      <FormField label="Test">
        <input placeholder="child input" />
      </FormField>,
    );
    expect(screen.getByPlaceholderText('child input')).toBeInTheDocument();
  });

  it('shows the error message when the error prop is provided', () => {
    render(
      <FormField label="Amount" error="Amount is required.">
        <input />
      </FormField>,
    );
    expect(screen.getByText('Amount is required.')).toBeInTheDocument();
  });

  it('does not render an error element when no error prop is given', () => {
    render(
      <FormField label="Amount">
        <input />
      </FormField>,
    );
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
  });

  it('associates the label with a child input via htmlFor', () => {
    render(
      <FormField label="Category" htmlFor="cat-select">
        <select id="cat-select" />
      </FormField>,
    );
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
  });

  it('calls render-prop children with the combined accessible label', () => {
    render(
      <FormField label="Item Name" fieldLabel="e.g. Whiskers Cat Food">
        {(accessibleLabel) => <input aria-label={accessibleLabel} />}
      </FormField>,
    );
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'aria-label',
      'Item Name, e.g. Whiskers Cat Food',
    );
  });

  it('renders the element returned by render-prop children', () => {
    render(
      <FormField label="Amount" fieldLabel="e.g. 25.00">
        {() => <input placeholder="dollar amount" />}
      </FormField>,
    );
    expect(screen.getByPlaceholderText('dollar amount')).toBeInTheDocument();
  });

  it('passes only the label when fieldLabel is omitted and children is a function', () => {
    render(
      <FormField label="Item Name">
        {(accessibleLabel) => <input aria-label={accessibleLabel} />}
      </FormField>,
    );
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-label', 'Item Name, ');
  });
});
