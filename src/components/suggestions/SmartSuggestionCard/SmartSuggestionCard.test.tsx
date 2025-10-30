import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SmartSuggestionCard } from './SmartSuggestionCard';

describe('SmartSuggestionCard', () => {
  it('renders title, description, badge and CTA', () => {
    const onClick = vi.fn();
    render(<SmartSuggestionCard title="Titre" description="Description" ctaLabel="CTA" onCtaClick={onClick} badgeLabel="Badge" />);

    expect(screen.getByText('Titre')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Badge')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'CTA' })).toBeInTheDocument();
  });

  it('fires onCtaClick when CTA is clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<SmartSuggestionCard title="Titre" description="Description" ctaLabel="CTA" onCtaClick={onClick} />);

    await user.click(screen.getByRole('button', { name: 'CTA' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
