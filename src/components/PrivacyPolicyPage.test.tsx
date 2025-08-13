import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import PrivacyPolicyPage from './PrivacyPolicyPage';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

describe('PrivacyPolicyPage', () => {
	const renderWithRouter = (component: React.ReactElement) => {
		return render(<BrowserRouter>{component}</BrowserRouter>);
	};

	it('should render the privacy policy page with correct title', () => {
		renderWithRouter(<PrivacyPolicyPage />);
		
		expect(screen.getByText('Politique de Confidentialité')).toBeInTheDocument();
	});

	it('should render the general information section', () => {
		renderWithRouter(<PrivacyPolicyPage />);
		
		expect(screen.getByText('Informations Générales')).toBeInTheDocument();
		expect(screen.getByText('En vigueur au 01/09/2024')).toBeInTheDocument();
	});

	it('should render all articles', () => {
		renderWithRouter(<PrivacyPolicyPage />);
		
		expect(screen.getByText('Article 1 – L\'Éditeur')).toBeInTheDocument();
		expect(screen.getByText('Article 2 – L\'Hébergeur')).toBeInTheDocument();
		expect(screen.getByText('Article 3 – Accès à AssuBot')).toBeInTheDocument();
		expect(screen.getByText('Article 4 – Collecte des Données')).toBeInTheDocument();
		expect(screen.getByText('Article 5 – Propriété Intellectuelle')).toBeInTheDocument();
		expect(screen.getByText('Article 6 – Documents Associés')).toBeInTheDocument();
		expect(screen.getByText('Article 7 – Contact et Mise à Jour')).toBeInTheDocument();
	});

	it('should render company information correctly', () => {
		renderWithRouter(<PrivacyPolicyPage />);
		
		expect(screen.getAllByText('SAS A L\'amiable')).toHaveLength(2);
		expect(screen.getAllByText('contact@a-lamiable.com')).toHaveLength(3);
		expect(screen.getByText('951 845 098')).toBeInTheDocument();
	});

	it('should render host information correctly', () => {
		renderWithRouter(<PrivacyPolicyPage />);
		
		expect(screen.getByText('Microsoft')).toBeInTheDocument();
		expect(screen.getByText(/One Microsoft Place/)).toBeInTheDocument();
	});

	it('should render the back button', () => {
		renderWithRouter(<PrivacyPolicyPage />);
		
		const backButton = screen.getByText('Retour');
		expect(backButton).toBeInTheDocument();
	});

	it('should call navigate when back button is clicked', () => {
		renderWithRouter(<PrivacyPolicyPage />);
		
		const backButton = screen.getByText('Retour');
		backButton.click();
		
		expect(mockNavigate).toHaveBeenCalledWith(-1);
	});

	it('should render security section', () => {
		renderWithRouter(<PrivacyPolicyPage />);
		
		expect(screen.getByText('Sécurité des Identifiants')).toBeInTheDocument();
	});

	it('should render data collection information', () => {
		renderWithRouter(<PrivacyPolicyPage />);
		
		expect(screen.getByText(/AssuBot assure à l'Utilisateur/)).toBeInTheDocument();
		expect(screen.getByText(/droit d'accès, de rectification/)).toBeInTheDocument();
	});

	it('should render intellectual property section', () => {
		renderWithRouter(<PrivacyPolicyPage />);
		
		expect(screen.getByText(/Tous les éléments de l'application AssuBot/)).toBeInTheDocument();
	});

	it('should render associated documents section', () => {
		renderWithRouter(<PrivacyPolicyPage />);
		
		expect(screen.getByText(/Conditions Générales d'Utilisation/)).toBeInTheDocument();
		expect(screen.getByText(/Politique de Cookies/)).toBeInTheDocument();
	});

	it('should render contact information', () => {
		renderWithRouter(<PrivacyPolicyPage />);
		
		expect(screen.getAllByText(/contact@a-lamiable.com/)).toHaveLength(3);
		expect(screen.getByText(/susceptibles d'être modifiées/)).toBeInTheDocument();
	});
});
