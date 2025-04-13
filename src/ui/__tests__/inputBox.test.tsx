import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InputBox from '../inputBox';

describe('InputBox Component', () => {
  const defaultProps = {
    id: 'test-input',
    label: 'Test Label',
    placeholder: 'Test Placeholder',
    register: {},
  };

  it('renders with label and input', () => {
    render(<InputBox {...defaultProps} />);
    
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Test Placeholder')).toBeInTheDocument();
  });

  it('displays error message when provided', () => {
    const error = 'This field is required';
    render(<InputBox {...defaultProps} error={error} />);
    
    expect(screen.getByText(error)).toBeInTheDocument();
  });

  it('toggles password visibility when showPasswordToggle is true', () => {
    const setShowPassword = jest.fn();
    render(
      <InputBox 
        {...defaultProps} 
        type="password" 
        showPasswordToggle 
        showPassword={false}
        setShowPassword={setShowPassword}
      />
    );
    
    const input = screen.getByPlaceholderText('Test Placeholder');
    const toggleButton = screen.getByTestId('password-toggle');
    
    expect(input).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(setShowPassword).toHaveBeenCalledWith(true);
  });

  it('applies error styles when error is provided', () => {
    render(<InputBox {...defaultProps} error="Error message" />);
    
    const input = screen.getByPlaceholderText('Test Placeholder');
    expect(input.className).toContain('border-red-500');
  });
});
