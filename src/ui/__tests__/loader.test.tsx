import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from '../loader';

describe('Loader Component', () => {
  it('renders with default size (medium)', () => {
    render(<Loader />);
    const loader = screen.getByTestId('loading-spinner');
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveClass('w-5', 'h-5');
    expect(loader).toHaveClass('animate-spin', 'rounded-full', 'border-4', 'border-t-transparent');
  });

  it('renders with small size', () => {
    render(<Loader size="small" />);
    const loader = screen.getByTestId('loading-spinner');
    expect(loader).toHaveClass('w-4', 'h-4');
    expect(loader).toHaveClass('animate-spin', 'rounded-full', 'border-4', 'border-t-transparent');
  });

  it('renders with large size', () => {
    render(<Loader size="large" />);
    const loader = screen.getByTestId('loading-spinner');
    expect(loader).toHaveClass('w-6', 'h-6');
    expect(loader).toHaveClass('animate-spin', 'rounded-full', 'border-4', 'border-t-transparent');
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-loader text-blue-500';
    render(<Loader className={customClass} />);
    const loader = screen.getByTestId('loading-spinner');
    expect(loader).toHaveClass('custom-loader', 'text-blue-500');
    expect(loader).toHaveClass('animate-spin', 'rounded-full', 'border-4', 'border-t-transparent');
  });

  it('combines default classes with custom classes', () => {
    const customClass = 'custom-loader';
    render(<Loader size="medium" className={customClass} />);
    const loader = screen.getByTestId('loading-spinner');
    expect(loader).toHaveClass('w-5', 'h-5', 'custom-loader');
    expect(loader).toHaveClass('animate-spin', 'rounded-full', 'border-4', 'border-t-transparent');
  });
});
