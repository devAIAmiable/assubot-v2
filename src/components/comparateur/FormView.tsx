import { FaCalculator, FaChevronLeft } from 'react-icons/fa';

import type { InsuranceType } from '../../types';
import React from 'react';

interface SimpleFormData {
	age: string;
	profession: string;
	location: string;
	postalCode: string;
	monthlyBudget: string;
	vehicleType: string;
	brand: string;
	model: string;
	energyType: string;
	transmission: string;
	vehicleValue: string;
	vehicleUse: string;
	annualMileage: string;
	parkingLocation: string;
	claimsHistory: string;
	drivingExperience: string;
	propertyType: string;
	propertyStatus: string;
	propertySize: string;
	numberOfRooms: string;
	hasAlarm: string;
	securityLevel: string;
	familyStatus: string;
	numberOfDependents: string;
	hasCurrentInsurance: string;
	wearGlasses: string;
	needsDental: string;
	coverageLevel: string;
}

interface FormViewProps {
	selectedType: InsuranceType | null;
	formData: SimpleFormData;
	updateFormField: (field: keyof SimpleFormData, value: string) => void;
	handleFormSubmit: () => void;
	setCurrentStep: (step: string) => void;
}

const FormView: React.FC<FormViewProps> = ({
	selectedType,
	formData,
	updateFormField,
	handleFormSubmit,
	setCurrentStep,
}) => {
	return (
		<div className="space-y-8">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Assurance {selectedType}</h1>
					<p className="text-gray-600">
						Remplissez vos informations pour obtenir des devis personnalisés
					</p>
				</div>
				<div className="flex items-center space-x-4">
					<button
						onClick={() => setCurrentStep('history')}
						className="text-gray-600 hover:text-[#1e51ab] font-medium flex items-center"
					>
						<FaChevronLeft className="h-4 w-4 mr-2" />
						Mes comparaisons
					</button>
					<span className="text-gray-300">|</span>
					<button
						onClick={() => setCurrentStep('type')}
						className="text-[#1e51ab] hover:text-[#163d82] font-medium flex items-center"
					>
						<FaChevronLeft className="h-4 w-4 mr-2" />
						Changer de type
					</button>
				</div>
			</div>

			<div className="bg-white border border-gray-100 rounded-2xl p-8">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleFormSubmit();
					}}
					className="space-y-6"
				>
					{/* Personal Information Section */}
					<div className="mb-8">
						<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
							<div className="w-8 h-8 bg-[#1e51ab] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</div>
							Informations personnelles
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Âge</label>
								<input
									type="number"
									value={formData.age}
									onChange={(e) => updateFormField('age', e.target.value)}
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
									placeholder="25"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Profession</label>
								<select
									value={formData.profession}
									onChange={(e) => updateFormField('profession', e.target.value)}
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
									required
								>
									<option value="">Sélectionnez</option>
									<option value="Cadre">Cadre</option>
									<option value="Employé">Employé</option>
									<option value="Profession libérale">Profession libérale</option>
									<option value="Fonctionnaire">Fonctionnaire</option>
									<option value="Étudiant">Étudiant</option>
									<option value="Retraité">Retraité</option>
									<option value="Artisan">Artisan/Commerçant</option>
									<option value="Ouvrier">Ouvrier</option>
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
								<input
									type="text"
									value={formData.location}
									onChange={(e) => updateFormField('location', e.target.value)}
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
									placeholder="Paris"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Code postal</label>
								<input
									type="text"
									value={formData.postalCode}
									onChange={(e) => updateFormField('postalCode', e.target.value)}
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
									placeholder="75001"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Budget mensuel maximum (€)</label>
								<input
									type="number"
									value={formData.monthlyBudget}
									onChange={(e) => updateFormField('monthlyBudget', e.target.value)}
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
									placeholder="50"
									required
								/>
							</div>
						</div>
					</div>

					{/* Insurance Type Specific Section */}
					{selectedType === 'auto' && (
						<div className="mb-8">
							<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
								<div className="w-8 h-8 bg-[#1e51ab] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
								Votre véhicule
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Type de véhicule</label>
									<select
										value={formData.vehicleType}
										onChange={(e) => updateFormField('vehicleType', e.target.value)}
										className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
										required
									>
										<option value="">Sélectionnez</option>
										<option value="car">Voiture</option>
										<option value="van">Utilitaire</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Marque</label>
									<input
										type="text"
										value={formData.brand}
										onChange={(e) => updateFormField('brand', e.target.value)}
										className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
										placeholder="ex: Renault"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Modèle</label>
									<input
										type="text"
										value={formData.model}
										onChange={(e) => updateFormField('model', e.target.value)}
										className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
										placeholder="ex: Clio 5"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Type d'énergie</label>
									<select
										value={formData.energyType}
										onChange={(e) => updateFormField('energyType', e.target.value)}
										className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
									>
										<option value="">Sélectionnez</option>
										<option value="petrol">Essence</option>
										<option value="diesel">Diesel</option>
										<option value="electric">Électrique</option>
										<option value="hybrid">Hybride</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
									<select
										value={formData.transmission}
										onChange={(e) => updateFormField('transmission', e.target.value)}
										className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
									>
										<option value="">Sélectionnez</option>
										<option value="manual">Manuelle</option>
										<option value="automatic">Automatique</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Valeur du véhicule (€)</label>
									<input
										type="number"
										value={formData.vehicleValue}
										onChange={(e) => updateFormField('vehicleValue', e.target.value)}
										className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
										placeholder="15000"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Usage du véhicule</label>
									<select
										value={formData.vehicleUse}
										onChange={(e) => updateFormField('vehicleUse', e.target.value)}
										className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
									>
										<option value="">Sélectionnez</option>
										<option value="private">Usage privé</option>
										<option value="professional">Usage professionnel</option>
										<option value="mixed">Usage mixte</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Kilométrage annuel</label>
									<input
										type="number"
										value={formData.annualMileage}
										onChange={(e) => updateFormField('annualMileage', e.target.value)}
										className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
										placeholder="12000"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Stationnement (nuit)</label>
									<select
										value={formData.parkingLocation}
										onChange={(e) => updateFormField('parkingLocation', e.target.value)}
										className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
									>
										<option value="">Sélectionnez</option>
										<option value="public_street">Rue publique</option>
										<option value="private_garage">Garage privé</option>
										<option value="gated_residence">Résidence fermée</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Expérience de conduite (années)</label>
									<input
										type="number"
										value={formData.drivingExperience}
										onChange={(e) => updateFormField('drivingExperience', e.target.value)}
										className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
										placeholder="5"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Historique de sinistres</label>
									<select
										value={formData.claimsHistory}
										onChange={(e) => updateFormField('claimsHistory', e.target.value)}
										className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
									>
										<option value="">Sélectionnez</option>
										<option value="none">Aucun sinistre</option>
										<option value="1_claim">1 sinistre</option>
										<option value="2_claims">2 sinistres</option>
										<option value="3_plus_claims">3 sinistres ou plus</option>
									</select>
								</div>
							</div>
						</div>
					)}

					{selectedType === 'habitation' && (
						<div className="mb-8">
							<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
								<div className="w-8 h-8 bg-[#1e51ab] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
								Votre logement
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Type de logement</label>
									<select
										value={formData.propertyType}
										onChange={(e) => updateFormField('propertyType', e.target.value)}
										className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
									>
										<option value="">Sélectionnez</option>
										<option value="apartment">Appartement</option>
										<option value="house">Maison</option>
										<option value="studio">Studio</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Statut d'occupation</label>
									<select
										value={formData.propertyStatus}
										onChange={(e) => updateFormField('propertyStatus', e.target.value)}
										className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
									>
										<option value="">Sélectionnez</option>
										<option value="owner">Propriétaire</option>
										<option value="tenant">Locataire</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Surface (m²)</label>
									<input
										type="number"
										value={formData.propertySize}
										onChange={(e) => updateFormField('propertySize', e.target.value)}
										className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
										placeholder="65"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Nombre de pièces</label>
									<input
										type="number"
										value={formData.numberOfRooms}
										onChange={(e) => updateFormField('numberOfRooms', e.target.value)}
										className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
										placeholder="3"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Système d'alarme</label>
									<select
										value={formData.hasAlarm}
										onChange={(e) => updateFormField('hasAlarm', e.target.value)}
										className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
									>
										<option value="">Sélectionnez</option>
										<option value="true">Oui</option>
										<option value="false">Non</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Niveau de sécurité</label>
									<select
										value={formData.securityLevel}
										onChange={(e) => updateFormField('securityLevel', e.target.value)}
										className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
									>
										<option value="">Sélectionnez</option>
										<option value="none">Aucune sécurité</option>
										<option value="basic">Sécurité de base</option>
										<option value="advanced">Sécurité renforcée</option>
									</select>
								</div>
							</div>
						</div>
					)}

					{selectedType === 'sante' && (
						<div className="mb-8">
							<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
								<div className="w-8 h-8 bg-[#1e51ab] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
								Situation familiale et besoins de santé
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Situation familiale</label>
									<select
										value={formData.familyStatus}
										onChange={(e) => updateFormField('familyStatus', e.target.value)}
										className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
									>
										<option value="">Sélectionnez</option>
										<option value="single">Célibataire</option>
										<option value="couple">En couple</option>
										<option value="family">Famille avec enfants</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Nombre d'ayants droit</label>
									<input
										type="number"
										value={formData.numberOfDependents}
										onChange={(e) => updateFormField('numberOfDependents', e.target.value)}
										className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
										placeholder="0"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Assurance actuelle</label>
									<select
										value={formData.hasCurrentInsurance}
										onChange={(e) => updateFormField('hasCurrentInsurance', e.target.value)}
										className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
									>
										<option value="">Sélectionnez</option>
										<option value="true">Oui</option>
										<option value="false">Non</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Port de lunettes</label>
									<select
										value={formData.wearGlasses}
										onChange={(e) => updateFormField('wearGlasses', e.target.value)}
										className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
									>
										<option value="">Sélectionnez</option>
										<option value="true">Oui</option>
										<option value="false">Non</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Soins dentaires fréquents</label>
									<select
										value={formData.needsDental}
										onChange={(e) => updateFormField('needsDental', e.target.value)}
										className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
									>
										<option value="">Sélectionnez</option>
										<option value="true">Oui</option>
										<option value="false">Non</option>
									</select>
								</div>
							</div>
						</div>
					)}

					{/* Coverage Section */}
					<div className="mb-8">
						<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
							<div className="w-8 h-8 bg-[#1e51ab] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</div>
							Couverture souhaitée
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Niveau de couverture</label>
								<select
									value={formData.coverageLevel}
									onChange={(e) => updateFormField('coverageLevel', e.target.value)}
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
									required
								>
									<option value="">Sélectionnez</option>
									{selectedType === 'auto' && (
										<>
											<option value="tiers">Au tiers</option>
											<option value="tiers_plus">Tiers étendu</option>
											<option value="tous_risques">Tous risques</option>
										</>
									)}
									{selectedType !== 'auto' && (
										<>
											<option value="basic">Basique</option>
											<option value="standard">Standard</option>
											<option value="premium">Premium</option>
										</>
									)}
								</select>
							</div>
						</div>
					</div>

					<div className="flex justify-end">
						<button
							type="submit"
							className="px-8 py-3 bg-[#1e51ab] text-white rounded-xl font-medium hover:bg-[#163d82] transition-colors flex items-center"
						>
							<FaCalculator className="h-4 w-4 mr-2" />
							Voir les offres
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default FormView; 