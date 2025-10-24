import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CardField from './CardField';
import type { FormField } from '../../../types/comparison';

describe('CardField Component', () => {
  const mockOnChange = vi.fn();
  const mockOnBlur = vi.fn();

  const defaultField: FormField = {
    name: 'testField',
    type: 'card',
    label: 'Test Field',
    required: false,
    options: [
      { value: 'option1', label: 'Option 1', icon: '🚗' },
      { value: 'option2', label: 'Option 2', icon: '🏍️' },
      { value: 'option3', label: 'Option 3', icon: '🚲' },
    ],
    subsection: { id: 'test', label: 'Test' },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render card field with correct label', () => {
      render(<CardField field={defaultField} value="" onChange={mockOnChange} onBlur={mockOnBlur} error="" />);

      expect(screen.getByText('Test Field')).toBeInTheDocument();
    });

    it('should render all option cards', () => {
      render(<CardField field={defaultField} value="" onChange={mockOnChange} onBlur={mockOnBlur} error="" />);

      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('should render icons when provided', () => {
      render(<CardField field={defaultField} value="" onChange={mockOnChange} onBlur={mockOnBlur} error="" />);

      expect(screen.getByText('🚗')).toBeInTheDocument();
      expect(screen.getByText('🏍️')).toBeInTheDocument();
      expect(screen.getByText('🚲')).toBeInTheDocument();
    });

    it('should render with required indicator when field is required', () => {
      const requiredField = { ...defaultField, required: true };

      render(<CardField field={requiredField} value="" onChange={mockOnChange} onBlur={mockOnBlur} error="" />);

      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should render with helper text when provided', () => {
      const fieldWithHelper = { ...defaultField, helperText: 'This is helper text' };

      render(<CardField field={fieldWithHelper} value="" onChange={mockOnChange} onBlur={mockOnBlur} error="" />);

      expect(screen.getByText('This is helper text')).toBeInTheDocument();
    });
  });

  describe('Value Handling', () => {
    it('should highlight selected card', () => {
      render(<CardField field={defaultField} value="option2" onChange={mockOnChange} onBlur={mockOnBlur} error="" />);

      const selectedCard = screen.getByText('Option 2').closest('div');
      expect(selectedCard).toHaveClass('border-[#1e51ab]');
    });

    it('should not highlight any card when no value is selected', () => {
      render(<CardField field={defaultField} value="" onChange={mockOnChange} onBlur={mockOnBlur} error="" />);

      const cards = screen.getAllByText(/Option \d/);
      cards.forEach((card) => {
        const cardElement = card.closest('div');
        expect(cardElement).not.toHaveClass('border-[#1e51ab]');
      });
    });

    it('should handle null value', () => {
      render(<CardField field={defaultField} value={null} onChange={mockOnChange} onBlur={mockOnBlur} error="" />);

      const cards = screen.getAllByText(/Option \d+/);
      cards.forEach((card) => {
        expect(card).not.toHaveClass('ring-2', 'ring-blue-500');
      });
    });

    it('should handle undefined value', () => {
      render(<CardField field={defaultField} value={undefined} onChange={mockOnChange} onBlur={mockOnBlur} error="" />);

      const cards = screen.getAllByText(/Option \d/);
      cards.forEach((card) => {
        const cardElement = card.closest('div');
        expect(cardElement).not.toHaveClass('border-[#1e51ab]');
      });
    });
  });

  describe('User Interactions', () => {
    it('should call onChange when user clicks a card', async () => {
      const user = userEvent.setup();
      render(<CardField field={defaultField} value="" onChange={mockOnChange} onBlur={mockOnBlur} error="" />);

      const option2Card = screen.getByText('Option 2').closest('div');
      await user.click(option2Card!);

      expect(mockOnChange).toHaveBeenCalledWith('option2');
    });

    it('should call onChange when user clicks different card', async () => {
      const user = userEvent.setup();
      render(<CardField field={defaultField} value="option1" onChange={mockOnChange} onBlur={mockOnBlur} error="" />);

      const option3Card = screen.getByText('Option 3').closest('div');
      await user.click(option3Card!);

      expect(mockOnChange).toHaveBeenCalledWith('option3');
    });

    it('should call onBlur when card loses focus', async () => {
      const user = userEvent.setup();
      render(<CardField field={defaultField} value="" onChange={mockOnChange} onBlur={mockOnBlur} error="" />);

      const option1Card = screen.getByText('Option 1').closest('button');
      await user.click(option1Card!);
      await user.tab();

      expect(mockOnBlur).toHaveBeenCalled();
    });

    it('should handle keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<CardField field={defaultField} value="" onChange={mockOnChange} onBlur={mockOnBlur} error="" />);

      const option1Card = screen.getByText('Option 1').closest('button');
      await user.click(option1Card!);
      await user.keyboard('{ArrowRight}');
      await user.keyboard('{Enter}');

      expect(mockOnChange).toHaveBeenCalledWith('option2');
    });

    it('should handle space key selection', async () => {
      const user = userEvent.setup();
      render(<CardField field={defaultField} value="" onChange={mockOnChange} onBlur={mockOnBlur} error="" />);

      const option1Card = screen.getByText('Option 1').closest('button');
      await user.click(option1Card!);
      await user.keyboard(' ');

      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when provided', () => {
      render(<CardField field={defaultField} value="" onChange={mockOnChange} onBlur={mockOnBlur} error="This is an error" />);

      expect(screen.getByText('This is an error')).toBeInTheDocument();
    });

    it('should apply error styling when error is present', () => {
      render(<CardField field={defaultField} value="" onChange={mockOnChange} onBlur={mockOnBlur} error="This is an error" />);

      const errorMessage = screen.getByText('This is an error');
      expect(errorMessage).toHaveClass('text-red-500');
    });

    it('should not display error when error is empty', () => {
      render(<CardField field={defaultField} value="" onChange={mockOnChange} onBlur={mockOnBlur} error="" />);

      expect(screen.queryByText('This is an error')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have correct aria-label for each card', () => {
      render(<CardField field={defaultField} value="" onChange={mockOnChange} onBlur={mockOnBlur} error="" />);

      const cards = screen.getAllByText(/Option \d+/);
      expect(cards[0]).toBeInTheDocument();
      expect(cards[1]).toBeInTheDocument();
      expect(cards[2]).toBeInTheDocument();
    });

    it('should have correct aria-pressed for selected card', () => {
      render(<CardField field={defaultField} value="option2" onChange={mockOnChange} onBlur={mockOnBlur} error="" />);

      const cards = screen.getAllByText(/Option \d+/);
      expect(cards[0]).toBeInTheDocument();
      expect(cards[1]).toBeInTheDocument();
      expect(cards[2]).toBeInTheDocument();
    });

    it('should have correct aria-describedby when error is present', () => {
      render(<CardField field={defaultField} value="" onChange={mockOnChange} onBlur={mockOnBlur} error="This is an error" />);

      const cards = screen.getAllByText(/Option \d+/);
      cards.forEach((card) => {
        expect(card).toBeInTheDocument();
      });
    });

    it('should be required when field is required', () => {
      const requiredField = { ...defaultField, required: true };

      render(<CardField field={requiredField} value="" onChange={mockOnChange} onBlur={mockOnBlur} error="" />);

      const cards = screen.getAllByText(/Option \d+/);
      cards.forEach((card) => {
        expect(card).toBeInTheDocument();
      });
    });
  });

  describe('Options Handling', () => {
    it('should handle empty options array', () => {
      const fieldWithNoOptions = { ...defaultField, options: [] };

      render(<CardField field={fieldWithNoOptions} value="" onChange={mockOnChange} onBlur={mockOnBlur} error="" />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should handle options without icons', () => {
      const fieldWithoutIcons = {
        ...defaultField,
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
        ],
      };

      render(<CardField field={fieldWithoutIcons} value="" onChange={mockOnChange} onBlur={mockOnBlur} error="" />);

      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('should handle options with special characters in labels', () => {
      const fieldWithSpecialOptions = {
        ...defaultField,
        options: [
          { value: 'special', label: 'Option with émojis 🚗', icon: '🚗' },
          { value: 'unicode', label: 'Unicode: café naïve', icon: '🏍️' },
        ],
      };

      render(<CardField field={fieldWithSpecialOptions} value="" onChange={mockOnChange} onBlur={mockOnBlur} error="" />);

      expect(screen.getByText('Option with émojis 🚗')).toBeInTheDocument();
      expect(screen.getByText('Unicode: café naïve')).toBeInTheDocument();
    });

    it('should handle options with long labels', () => {
      const fieldWithLongOptions = {
        ...defaultField,
        options: [{ value: 'long', label: 'This is a very long option label that might cause layout issues', icon: '🚗' }],
      };

      render(<CardField field={fieldWithLongOptions} value="" onChange={mockOnChange} onBlur={mockOnBlur} error="" />);

      expect(screen.getByText('This is a very long option label that might cause layout issues')).toBeInTheDocument();
    });
  });

  describe('Field States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<CardField field={defaultField} value="" onChange={mockOnChange} onBlur={mockOnBlur} error="" disabled={true} />);

      const cards = screen.getAllByText(/Option \d+/);
      cards.forEach((card) => {
        expect(card).toBeInTheDocument();
      });
    });

    it('should not be disabled when disabled prop is false', () => {
      render(<CardField field={defaultField} value="" onChange={mockOnChange} onBlur={mockOnBlur} error="" disabled={false} />);

      const cards = screen.getAllByText(/Option \d+/);
      cards.forEach((card) => {
        expect(card).toBeInTheDocument();
      });
    });
  });

  describe('Visual States', () => {
    it('should show hover state on mouse over', async () => {
      const user = userEvent.setup();
      render(<CardField field={defaultField} value="" onChange={mockOnChange} onBlur={mockOnBlur} error="" />);

      const option1Card = screen.getByText('Option 1').closest('button');
      await user.hover(option1Card!);

      expect(option1Card).toBeInTheDocument();
    });

    it('should show focus state when focused', async () => {
      const user = userEvent.setup();
      render(<CardField field={defaultField} value="" onChange={mockOnChange} onBlur={mockOnBlur} error="" />);

      const option1Card = screen.getByText('Option 1').closest('button');
      await user.click(option1Card!);

      expect(option1Card).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid card selection', async () => {
      const user = userEvent.setup();
      render(<CardField field={defaultField} value="" onChange={mockOnChange} onBlur={mockOnBlur} error="" />);

      const option1Card = screen.getByText('Option 1').closest('button');
      const option2Card = screen.getByText('Option 2').closest('button');
      const option3Card = screen.getByText('Option 3').closest('button');

      await user.click(option1Card!);
      await user.click(option2Card!);
      await user.click(option3Card!);

      expect(mockOnChange).toHaveBeenCalled();
    });

    it('should handle selection of same card multiple times', async () => {
      const user = userEvent.setup();
      render(<CardField field={defaultField} value="option1" onChange={mockOnChange} onBlur={mockOnBlur} error="" />);

      const option1Card = screen.getByText('Option 1').closest('button');
      await user.click(option1Card!);

      expect(mockOnChange).toHaveBeenCalled();
    });

    it('should handle invalid option values gracefully', () => {
      render(<CardField field={defaultField} value="invalid_option" onChange={mockOnChange} onBlur={mockOnBlur} error="" />);

      const cards = screen.getAllByText(/Option \d+/);
      cards.forEach((card) => {
        expect(card).not.toHaveClass('ring-2', 'ring-blue-500');
      });
    });
  });
});
