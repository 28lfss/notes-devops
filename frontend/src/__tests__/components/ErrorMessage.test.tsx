import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorMessage } from '../../components/ErrorMessage';

describe('ErrorMessage', () => {
  it('should render error message', () => {
    render(<ErrorMessage message="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('should not render when message is empty', () => {
    const { container } = render(<ErrorMessage message="" />);
    expect(container.firstChild).toBeNull();
  });

  it('should apply error styling', () => {
    render(<ErrorMessage message="Error message" />);
    const errorElement = screen.getByText('Error message');
    expect(errorElement).toHaveClass('bg-red-100');
    expect(errorElement).toHaveClass('border-red-400');
    expect(errorElement).toHaveClass('text-red-700');
  });

  it('should apply custom className', () => {
    render(<ErrorMessage message="Error" className="custom-class" />);
    const errorElement = screen.getByText('Error');
    expect(errorElement).toHaveClass('custom-class');
  });
});

