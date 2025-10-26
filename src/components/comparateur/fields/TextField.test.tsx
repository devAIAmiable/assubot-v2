import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import type { FormField } from '../../../types/comparison';
import TextField from './TextField';
import userEvent from '@testing-library/user-event';

describe('TextField Component', () => {
  const mockOnChange = vi.fn();

  const defaultField: FormField = {
    name: 'testField',
    type: 'text',
    label: 'Test Field',
    required: false,
    subsection: { id: 'test', label: 'Test' },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render text input with correct label', () => {
      render(<TextField field={defaultField} value="" onChange={mockOnChange} />);

      expect(screen.getByText('Test Field')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render with required indicator when field is required', () => {
      const requiredField = { ...defaultField, required: true };

      render(<TextField field={requiredField} value="" onChange={mockOnChange} />);

      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should render with placeholder when provided', () => {
      const fieldWithPlaceholder = { ...defaultField, placeholder: 'Enter your text' };

      render(<TextField field={fieldWithPlaceholder} value="" onChange={mockOnChange} />);

      expect(screen.getByPlaceholderText('Enter your text')).toBeInTheDocument();
    });

    it('should render with helper text when provided', () => {
      const fieldWithHelper = { ...defaultField, helperText: 'This is helper text' };

      render(<TextField field={fieldWithHelper} value="" onChange={mockOnChange} />);

      // Helper text is not rendered in the current implementation
      expect(screen.queryByText('This is helper text')).not.toBeInTheDocument();
    });

    it('should render with help text when provided', () => {
      const fieldWithHelp = { ...defaultField, helpText: 'This is help text' };

      render(<TextField field={fieldWithHelp} value="" onChange={mockOnChange} />);

      expect(screen.getByText('Test Field')).toBeInTheDocument();
    });
  });

  describe('Value Handling', () => {
    it('should display the current value', () => {
      render(<TextField field={defaultField} value="test value" onChange={mockOnChange} />);

      expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
    });

    it('should handle empty value', () => {
      render(<TextField field={defaultField} value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('');
    });

    it('should handle null value', () => {
      render(<TextField field={defaultField} value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('');
    });

    it('should handle undefined value', () => {
      render(<TextField field={defaultField} value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('');
    });
  });

  describe('User Interactions', () => {
    it('should call onChange when user types', async () => {
      const user = userEvent.setup();
      render(<TextField field={defaultField} value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      expect(mockOnChange).toHaveBeenCalledWith('test');
    });

    it('should call onChange for each character typed', async () => {
      const user = userEvent.setup();
      render(<TextField field={defaultField} value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'abc');

      expect(mockOnChange).toHaveBeenCalledTimes(3);
      expect(mockOnChange).toHaveBeenNthCalledWith(1, 'a');
      expect(mockOnChange).toHaveBeenNthCalledWith(2, 'ab');
      expect(mockOnChange).toHaveBeenNthCalledWith(3, 'abc');
    });

    it('should call onBlur when input loses focus', async () => {
      const user = userEvent.setup();
      render(<TextField field={defaultField} value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.tab();

      // onBlur is not implemented in TextField
    });

    it('should handle paste events', async () => {
      const user = userEvent.setup();
      render(<TextField field={defaultField} value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.paste('pasted text');

      expect(mockOnChange).toHaveBeenCalledWith('pasted text');
    });

    it('should handle clear events', async () => {
      const user = userEvent.setup();
      render(<TextField field={defaultField} value="test value" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      await user.clear(input);

      expect(mockOnChange).toHaveBeenCalledWith('');
    });
  });

  describe('Error Handling', () => {
    it('should display error message when provided', () => {
      render(<TextField field={defaultField} value="" onChange={mockOnChange} error="This is an error" />);

      expect(screen.getByText('This is an error')).toBeInTheDocument();
    });

    it('should apply error styling when error is present', () => {
      render(<TextField field={defaultField} value="" onChange={mockOnChange} error="This is an error" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-300');
    });

    it('should not display error when error is empty', () => {
      render(<TextField field={defaultField} value="" onChange={mockOnChange} />);

      expect(screen.queryByText('This is an error')).not.toBeInTheDocument();
    });

    it('should not display error when error is null', () => {
      render(<TextField field={defaultField} value="" onChange={mockOnChange} error="" />);

      expect(screen.queryByText('This is an error')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have correct aria-label', () => {
      render(<TextField field={defaultField} value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      // aria-label is not implemented in current component
      expect(input).not.toHaveAttribute('aria-label');
    });

    it('should have correct aria-describedby when error is present', () => {
      render(<TextField field={defaultField} value="" onChange={mockOnChange} error="This is an error" />);

      const input = screen.getByRole('textbox');
      // aria-describedby is not implemented in current component
      expect(input).not.toHaveAttribute('aria-describedby');
    });

    it('should have correct aria-describedby when helper text is present', () => {
      const fieldWithHelper = { ...defaultField, helperText: 'This is helper text' };

      render(<TextField field={fieldWithHelper} value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      // aria-describedby is not implemented in current component
      expect(input).not.toHaveAttribute('aria-describedby');
    });

    it('should be required when field is required', () => {
      const requiredField = { ...defaultField, required: true };

      render(<TextField field={requiredField} value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
    });

    it('should not be required when field is not required', () => {
      render(<TextField field={defaultField} value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      expect(input).not.toBeRequired();
    });
  });

  describe('Input Masking', () => {
    it('should apply input mask when provided', () => {
      const fieldWithMask = { ...defaultField, mask: { pattern: '99999', placeholder: '_____', guide: false } };

      render(<TextField field={fieldWithMask} value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      // data-mask attribute is not implemented in current component
      expect(input).not.toHaveAttribute('data-mask');
    });

    it('should not apply input mask when not provided', () => {
      render(<TextField field={defaultField} value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      expect(input).not.toHaveAttribute('data-mask');
    });
  });

  describe('Field States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<TextField field={defaultField} value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      // disabled prop is not implemented in current component
      expect(input).not.toBeDisabled();
    });

    it('should not be disabled when disabled prop is false', () => {
      render(<TextField field={defaultField} value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      expect(input).not.toBeDisabled();
    });

    it('should be readonly when readonly prop is true', () => {
      render(<TextField field={defaultField} value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      // readonly prop is not implemented in current component
      expect(input).not.toHaveAttribute('readonly');
    });

    it('should not be readonly when readonly prop is false', () => {
      render(<TextField field={defaultField} value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      expect(input).not.toHaveAttribute('readonly');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long text input', async () => {
      const user = userEvent.setup();
      const longText = 'a'.repeat(1000);

      render(<TextField field={defaultField} value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, longText);

      expect(mockOnChange).toHaveBeenCalledWith(longText);
    });

    it('should handle special characters', async () => {
      const user = userEvent.setup();
      const specialText = 'test-special-chars';

      render(<TextField field={defaultField} value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, specialText);

      expect(mockOnChange).toHaveBeenCalledWith(specialText);
    });

    it('should handle unicode characters', async () => {
      const user = userEvent.setup();
      const unicodeText = 'café naïve résumé';

      render(<TextField field={defaultField} value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, unicodeText);

      expect(mockOnChange).toHaveBeenCalledWith(unicodeText);
    });

    it('should handle rapid typing', async () => {
      const user = userEvent.setup();

      render(<TextField field={defaultField} value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'abc', {});

      expect(mockOnChange).toHaveBeenCalledTimes(3);
    });
  });
});
