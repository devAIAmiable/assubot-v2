import { FaArrowLeft } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import remarkGfm from 'remark-gfm';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicyPage = () => {
	const navigate = useNavigate();

	const privacyPolicyContent = `# Politique de Confidentialité

## Informations Générales
**En vigueur au 01/09/2024**

Conformément aux dispositions des Articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004 pour la Confiance dans l'économie numérique (L.C.E.N.), il est porté à la connaissance des utilisateurs et visiteurs de l'application AssuBot les présentes mentions légales.

L'utilisation des services AssuBot par l'Utilisateur implique l'acceptation intégrale et sans réserve des présentes mentions légales. Celles-ci sont accessibles sur l'application à la rubrique « Mentions légales » de la page « Mon Compte ».

## Article 1 – L'Éditeur

- **Nom de la société :** SAS A L'amiable
- **Adresse :** 59 Rue de Ponthieu Bureau 326, 75008 Paris, France
- **Email :** contact@a-lamiable.com
- **Numéro de SIRET :** 951 845 098
- **Responsable de publication :** SAS A L'amiable

## Article 2 – L'Hébergeur

- **Hébergeur :** Microsoft
- **Adresse :** One Microsoft Place, South County Business Park, Leopardstown, Dublin 18 D18 P521, Ireland
- **Entité locale :** 39 Quai du Président Roosevelt, 92130 Issy-les-Moulineaux, France

## Article 3 – Accès à AssuBot

AssuBot est accessible en tout endroit 7j/7 24h/24 sauf cas de force majeure, interruption programmée ou non, et pouvant découler d'une nécessité de maintenance. En cas de modification, interruption ou suspension de AssuBot, l'Éditeur ne saurait être tenu responsable.

### Sécurité des Identifiants

L'accès aux services de l'application AssuBot est sécurisé par des identifiants de connexion (adresse email et mot de passe) créés par l'utilisateur lors de l'inscription. L'utilisateur s'engage à conserver ses identifiants confidentiels et à ne pas les communiquer à des tiers. Toute connexion à l'application ou transmission de données effectuée à partir des identifiants de l'utilisateur sera réputée avoir été effectuée par ce dernier.

## Article 4 – Collecte des Données

AssuBot assure à l'Utilisateur une collecte et un traitement d'informations personnelles dans le respect de la vie privée conformément à la loi n°78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés. En vertu de la loi Informatique et Libertés, l'Utilisateur dispose d'un droit d'accès, de rectification, de suppression et d'opposition de ses données personnelles. L'Utilisateur exerce ce droit par mail à l'adresse : **contact@a-lamiable.com**.

## Article 5 – Propriété Intellectuelle

Tous les éléments de l'application AssuBot, y compris mais sans s'y limiter, les textes, images, logos, graphismes, vidéos, sons et marques sont protégés par les lois françaises et internationales relatives à la propriété intellectuelle. Ces éléments sont la propriété exclusive de l'éditeur ou sont utilisés avec l'autorisation de leurs titulaires respectifs.

## Article 6 – Documents Associés

Pour une information complète sur les conditions d'utilisation des services AssuBot, les utilisateurs sont invités à consulter les documents suivants :

- Les **Conditions Générales d'Utilisation (CGU)** et les **Conditions Générales de Vente (CGV)**.
- La **Politique de Cookies** accessible via le module de gestion des cookies fourni par notre prestataire AXEPTIO.

## Article 7 – Contact et Mise à Jour

Pour toute question concernant les présentes mentions légales, l'utilisateur peut contacter l'éditeur à l'adresse suivante : **contact@a-lamiable.com**.

Les présentes mentions légales sont susceptibles d'être modifiées ou complétées à tout moment, les utilisateurs sont donc invités à les consulter régulièrement.`;

	const handleGoBack = () => {
		navigate(-1);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<motion.button
						onClick={handleGoBack}
						className="flex items-center space-x-2 text-gray-600 hover:text-[#1e51ab] transition-colors duration-200 mb-6"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6 }}
					>
						<FaArrowLeft className="h-4 w-4" />
						<span className="text-sm font-medium">Retour</span>
					</motion.button>
				</div>
			</div>

			{/* Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="max-w-4xl mx-auto">
					{/* Content */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
					>
						<div className="prose prose-lg max-w-none">
							<ReactMarkdown
								remarkPlugins={[remarkGfm]}
								components={{
									h1: ({ children }) => (
										<h1 className="text-3xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">
											{children}
										</h1>
									),
									h2: ({ children }) => (
										<h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">{children}</h2>
									),
									h3: ({ children }) => (
										<h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">{children}</h3>
									),
									p: ({ children }) => (
										<p className="text-gray-700 mb-4 leading-relaxed">{children}</p>
									),
									ul: ({ children }) => (
										<ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">{children}</ul>
									),
									ol: ({ children }) => (
										<ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2">
											{children}
										</ol>
									),
									li: ({ children }) => <li className="text-gray-700 leading-relaxed">{children}</li>,
									strong: ({ children }) => (
										<strong className="font-semibold text-gray-900">{children}</strong>
									),
									em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
									blockquote: ({ children }) => (
										<blockquote className="border-l-4 border-[#1e51ab] pl-4 py-2 my-4 bg-blue-50 rounded-r-lg">
											{children}
										</blockquote>
									),
									code: ({ children }) => (
										<code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">
											{children}
										</code>
									),
									pre: ({ children }) => (
										<pre className="bg-gray-100 text-gray-800 p-4 rounded-lg overflow-x-auto mb-4">
											{children}
										</pre>
									),
									table: ({ children }) => (
										<div className="overflow-x-auto mb-6">
											<table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
												{children}
											</table>
										</div>
									),
									thead: ({ children }) => (
										<thead className="bg-gray-50 border-b border-gray-200">{children}</thead>
									),
									tbody: ({ children }) => (
										<tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
									),
									tr: ({ children, ...props }) => (
										<tr className="hover:bg-gray-50 transition-colors" {...props}>
											{children}
										</tr>
									),
									th: ({ children }) => (
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											{children}
										</th>
									),
									td: ({ children }) => (
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{children}</td>
									),
								}}
							>
								{privacyPolicyContent}
							</ReactMarkdown>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
};

export default PrivacyPolicyPage;
