import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import PasswordStrengthMeter from './PasswordStrengthMeter';

describe('PasswordStrengthMeter', () => {
	it('should not render when password is empty', () => {
		render(<PasswordStrengthMeter password="" />);
		expect(screen.queryByText('Force du mot de passe :')).not.toBeInTheDocument();
	});

	it('should show custom rule violations', () => {
		render(<PasswordStrengthMeter password="weak" />);
		
		expect(screen.getByText('Critères non respectés')).toBeInTheDocument();
		expect(screen.getByText('Majuscule manquante')).toBeInTheDocument();
		expect(screen.getByText('Chiffre manquant')).toBeInTheDocument();
		expect(screen.getByText('Caractère spécial manquant')).toBeInTheDocument();
		expect(screen.getByText('Trop court (min 8 caractères)')).toBeInTheDocument();
	});

	it('should show specific missing requirements', () => {
		render(<PasswordStrengthMeter password="password123" />);
		
		expect(screen.getByText('Critères non respectés')).toBeInTheDocument();
		expect(screen.getByText('Majuscule manquante')).toBeInTheDocument();
		expect(screen.getByText('Caractère spécial manquant')).toBeInTheDocument();
		expect(screen.queryByText('Minuscule manquante')).not.toBeInTheDocument();
		expect(screen.queryByText('Chiffre manquant')).not.toBeInTheDocument();
		expect(screen.queryByText('Trop court (min 8 caractères)')).not.toBeInTheDocument();
	});

	it('should show zxcvbn feedback when custom rules pass', () => {
		render(<PasswordStrengthMeter password="ValidPass123!" />);
		
		// Should not show custom rule violations
		expect(screen.queryByText('Critères non respectés')).not.toBeInTheDocument();
		expect(screen.queryByText('Majuscule manquante')).not.toBeInTheDocument();
		
		// Should show zxcvbn strength (will be "Bon" or "Très bon" for this password)
		expect(screen.getByText(/Bon|Très bon|Moyen/)).toBeInTheDocument();
	});

	it('should show red color when custom rules fail', () => {
		render(<PasswordStrengthMeter password="weak" />);
		
		const strengthText = screen.getByText('Critères non respectés');
		expect(strengthText).toHaveClass('text-red-600');
	});

	it('should show appropriate color based on zxcvbn score when custom rules pass', () => {
		render(<PasswordStrengthMeter password="ValidPass123!" />);
		
		const strengthText = screen.getByText(/Bon|Très bon|Moyen/);
		// Should not be red when custom rules pass
		expect(strengthText).not.toHaveClass('text-red-600');
	});
});
