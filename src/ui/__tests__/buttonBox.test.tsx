import React from 'react';
import { render, screen } from '@testing-library/react';
import ButtonBox from '../buttonBox';

describe('ButtonBox Component', () => {
  const defaultProps = {
    children: 'Test Button',
    onClick: jest.fn(),
  };

  it('renders button with text', () => {
    render(<ButtonBox {...defaultProps} />);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('shows loading state when loading prop is true', () => {
    render(<ButtonBox {...defaultProps} loading />);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.queryByText('Test Button')).not.toBeInTheDocument();
  });

  it('disables button when loading', () => {
    render(<ButtonBox {...defaultProps} loading />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies custom className when provided', () => {
    render(<ButtonBox {...defaultProps} className="custom-class" />);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});
