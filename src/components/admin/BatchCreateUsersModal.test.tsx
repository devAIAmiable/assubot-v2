import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import BatchCreateUsersModal from './BatchCreateUsersModal';
import { usersService } from '../../services/users';

vi.mock('../../services/users', () => {
  return {
    usersService: {
      batchCreate: vi.fn(),
    },
  };
});

const renderModal = () => render(<BatchCreateUsersModal open={true} onClose={() => {}} />);

describe('BatchCreateUsersModal', () => {
  it('renders and allows adding/removing rows', async () => {
    renderModal();
    const user = userEvent.setup();

    // one initial row present
    expect(screen.getAllByRole('textbox').length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: /ajouter une ligne/i }));

    // should have more inputs after adding a row
    expect(screen.getAllByRole('textbox').length).toBeGreaterThan(4);
  });

  it('validates required fields and password length', async () => {
    renderModal();
    const user = userEvent.setup();

    // Try to submit empty form
    await user.click(screen.getByRole('button', { name: /^créer$/i }));

    await waitFor(() => {
      expect(screen.getByText(/le prénom est requis/i)).toBeInTheDocument();
    });

    // Fill minimum fields but invalid password
    await user.type(screen.getByRole('textbox', { name: '' }), 'user@example.com');
    const inputs = screen.getAllByRole('textbox');
    // Heuristic: first 4 textboxes correspond to email, firstName, lastName plus maybe others; fill firstName and lastName by index
    await user.type(inputs[1], 'Jean');
    await user.type(inputs[2], 'Dupont');

    const passwordField = screen.getByLabelText('password', { selector: 'input[type="password"]' }) as HTMLInputElement | null;
    if (passwordField) {
      await user.type(passwordField, 'short');
    }

    await user.click(screen.getByRole('button', { name: /^créer$/i }));

    await waitFor(() => {
      expect(screen.getByText(/au moins 8 caractères/i)).toBeInTheDocument();
    });
  });

  it('submits and displays results on success', async () => {
    vi.mocked(usersService.batchCreate).mockResolvedValueOnce({
      success: true,
      data: {
        message: 'Batch user creation completed: 1 succeeded, 0 failed',
        resource: {
          summary: { total: 1, successCount: 1, failureCount: 0, initialCredits: 100 },
          results: [{ success: true, email: 'ok@example.com', userId: 'u1', error: null }],
        },
      },
    });

    renderModal();
    const user = userEvent.setup();

    const inputs = screen.getAllByRole('textbox');
    await user.type(inputs[0], 'ok@example.com');
    await user.type(inputs[1], 'Jean');
    await user.type(inputs[2], 'Dupont');

    const passwordInputs = screen.getAllByLabelText('password', { selector: 'input' });
    if (passwordInputs[0]) {
      await user.type(passwordInputs[0] as HTMLInputElement, 'password123');
    }

    await user.clear(screen.getByDisplayValue('0'));
    await user.type(screen.getByRole('spinbutton'), '100');

    await user.click(screen.getByRole('button', { name: /^créer$/i }));

    await waitFor(() => {
      expect(screen.getByText(/réussites: 1/i)).toBeInTheDocument();
      expect(usersService.batchCreate).toHaveBeenCalled();
    });
  });
});
