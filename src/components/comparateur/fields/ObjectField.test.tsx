import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ObjectField from './ObjectField';
import type { FormField } from '../../../types/comparison';

describe('ObjectField Component', () => {
  const mockOnChange = vi.fn();

  const defaultField: FormField = {
    name: 'testField',
    type: 'object',
    label: 'Test Field',
    required: false,
    objectSchema: {
      type: 'object',
      properties: {
        child1: { type: 'date', label: 'Enfant 1' },
        child2: { type: 'date', label: 'Enfant 2' },
        child3: { type: 'date', label: 'Enfant 3' },
      },
    },
    subsection: { id: 'test', label: 'Test' },
  };

  const defaultValue = {
    child1: '2010-01-01',
    child2: '2012-01-01',
    child3: '2014-01-01',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render object field with correct label', () => {
      render(<ObjectField field={defaultField} value={{}} onChange={mockOnChange} />);

      expect(screen.getByText('Test Field')).toBeInTheDocument();
    });

    it('should render configure button', () => {
      render(<ObjectField field={defaultField} value={{}} onChange={mockOnChange} />);

      expect(screen.getByText('Configurer')).toBeInTheDocument();
    });

    it('should show configuration summary when value exists', () => {
      render(<ObjectField field={defaultField} value={defaultValue} onChange={mockOnChange} />);

      expect(screen.getByText('Configuration enregistrée (3 propriétés)')).toBeInTheDocument();
    });

    it('should not show configuration summary when value is empty', () => {
      render(<ObjectField field={defaultField} value={{}} onChange={mockOnChange} />);

      expect(screen.queryByText(/Configuration enregistrée/)).not.toBeInTheDocument();
    });
  });

  describe('Expand/Collapse Functionality', () => {
    it('should expand when configure button is clicked', async () => {
      const user = userEvent.setup();
      render(<ObjectField field={defaultField} value={{}} onChange={mockOnChange} />);

      const configureButton = screen.getByText('Configurer');
      await user.click(configureButton);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByText('Masquer')).toBeInTheDocument();
    });

    it('should collapse when hide button is clicked', async () => {
      const user = userEvent.setup();
      render(<ObjectField field={defaultField} value={{}} onChange={mockOnChange} />);

      // First expand
      const configureButton = screen.getByText('Configurer');
      await user.click(configureButton);

      // Then collapse
      const hideButton = screen.getByText('Masquer');
      await user.click(hideButton);

      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      expect(screen.getByText('Configurer')).toBeInTheDocument();
    });
  });

  describe('JSON Input Handling', () => {
    it('should handle valid JSON input', async () => {
      const user = userEvent.setup();
      render(<ObjectField field={defaultField} value={{}} onChange={mockOnChange} />);

      // Expand the field
      const configureButton = screen.getByText('Configurer');
      await user.click(configureButton);

      const textarea = screen.getByRole('textbox');
      const validJson = '{"child1": "2010-01-01", "child2": "2012-01-01"}';
      fireEvent.change(textarea, { target: { value: validJson } });

      expect(mockOnChange).toHaveBeenCalledWith({
        child1: '2010-01-01',
        child2: '2012-01-01',
      });
    });

    it('should handle invalid JSON input', async () => {
      const user = userEvent.setup();
      render(<ObjectField field={defaultField} value={{}} onChange={mockOnChange} />);

      // Expand the field
      const configureButton = screen.getByText('Configurer');
      await user.click(configureButton);

      const textarea = screen.getByRole('textbox');
      const invalidJson = '{"child1": "2010-01-01", "child2":}';
      fireEvent.change(textarea, { target: { value: invalidJson } });

      expect(mockOnChange).toHaveBeenCalledWith({});
    });

    it('should display current value as JSON when expanded', async () => {
      const user = userEvent.setup();
      render(<ObjectField field={defaultField} value={defaultValue} onChange={mockOnChange} />);

      // Expand the field
      const configureButton = screen.getByText('Configurer');
      await user.click(configureButton);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue(JSON.stringify(defaultValue, null, 2));
    });
  });

  describe('Field States', () => {
    it('should be enabled by default', async () => {
      render(<ObjectField field={defaultField} value={defaultValue} onChange={mockOnChange} />);

      // Click the configure button to expand the field
      const configureButton = screen.getByText('Configurer');
      await userEvent.click(configureButton);

      const textarea = screen.getByRole('textbox');
      expect(textarea).not.toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when error prop is provided', () => {
      render(<ObjectField field={defaultField} value={{}} onChange={mockOnChange} error="This field is required" />);

      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should apply error styling to textarea when error is present', async () => {
      render(<ObjectField field={defaultField} value={{}} onChange={mockOnChange} error="This field is required" />);

      // Expand the field
      const configureButton = screen.getByText('Configurer');
      await userEvent.click(configureButton);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('border-red-300');
    });
  });

  describe('Helper Text', () => {
    it('should display helper text when provided', () => {
      const fieldWithHelper = {
        ...defaultField,
        helperText: 'Enter the birth years of your children',
      };

      render(<ObjectField field={fieldWithHelper} value={{}} onChange={mockOnChange} />);

      expect(screen.getByText('Enter the birth years of your children')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid changes to textarea', async () => {
      const user = userEvent.setup();
      render(<ObjectField field={defaultField} value={{}} onChange={mockOnChange} />);

      // Expand the field
      const configureButton = screen.getByText('Configurer');
      await user.click(configureButton);

      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: '{"child1": "2010-01-01"}' } });
      fireEvent.change(textarea, { target: { value: '{"child2": "2012-01-01"}' } });

      expect(mockOnChange).toHaveBeenCalled();
    });

    it('should handle clearing of textarea', async () => {
      const user = userEvent.setup();
      render(<ObjectField field={defaultField} value={defaultValue} onChange={mockOnChange} />);

      // Expand the field
      const configureButton = screen.getByText('Configurer');
      await user.click(configureButton);

      const textarea = screen.getByRole('textbox');
      await user.clear(textarea);

      expect(mockOnChange).toHaveBeenCalledWith({});
    });

    it('should handle invalid object values gracefully', async () => {
      const user = userEvent.setup();
      render(<ObjectField field={defaultField} value={{}} onChange={mockOnChange} />);

      // Expand the field
      const configureButton = screen.getByText('Configurer');
      await user.click(configureButton);

      const textarea = screen.getByRole('textbox');
      const invalidJson = '{"child1": "2010-01-01", "child2":}';
      fireEvent.change(textarea, { target: { value: invalidJson } });

      expect(mockOnChange).toHaveBeenCalledWith({});
    });
  });
});
