import {
	FaCalendarAlt,
	FaCheck,
	FaEdit,
	FaEnvelope,
	FaGoogle,
	FaLock,
	FaMapMarkerAlt,
	FaSave,
	FaTimes,
	FaUser,
} from 'react-icons/fa';
import { useAppSelector } from '../store/hooks';

import { getUserState } from '../utils/stateHelpers';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import Dropdown, { type DropdownOption } from './ui/Dropdown';
import Avatar from './ui/Avatar';
import { useProfileUpdate } from '../hooks/useProfileUpdate';
import { usePasswordChange } from '../hooks/usePasswordChange';
import { useAvatarUpload } from '../hooks/useAvatarUpload';
import { formatDateForAPI, formatDateForInput } from '../utils/dateHelpers';
import { showToast } from './ui/Toast';

const ProfileModule = () => {
	const { currentUser } = useAppSelector(getUserState);
	const { updateProfile, loading: profileLoading } = useProfileUpdate();
	const { changePassword, loading: passwordLoading } = usePasswordChange();
	const { uploadAvatar, loading: avatarLoading } = useAvatarUpload();

	const [isEditingPersonal, setIsEditingPersonal] = useState(false);
	const [isEditingAddress, setIsEditingAddress] = useState(false);
	const [isChangingPassword, setIsChangingPassword] = useState(false);

	// Form states
	const [personalForm, setPersonalForm] = useState({
		firstName: currentUser?.firstName || '',
		lastName: currentUser?.lastName || '',
		birthDate: formatDateForInput(currentUser?.birthDate),
		gender: currentUser?.gender || '',
		professionalCategory: currentUser?.professionalCategory || '',
	});

	const [addressForm, setAddressForm] = useState({
		address: currentUser?.address || '',
		city: currentUser?.city || '',
		zip: currentUser?.zip || '',
	});

	const [passwordForm, setPasswordForm] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});

	// Update form state when currentUser changes
	useEffect(() => {
		if (currentUser) {
			setPersonalForm({
				firstName: currentUser.firstName || '',
				lastName: currentUser.lastName || '',
				birthDate: formatDateForInput(currentUser.birthDate),
				gender: currentUser.gender || '',
				professionalCategory: currentUser.professionalCategory || '',
			});

			setAddressForm({
				address: currentUser.address || '',
				city: currentUser.city || '',
				zip: currentUser.zip || '',
			});
		}
	}, [currentUser]);

	// Dropdown options
	const genderOptions: DropdownOption[] = [
		{ value: 'Homme', label: 'Homme' },
		{ value: 'Femme', label: 'Femme' },
		{ value: 'Autre', label: 'Autre' },
	];

	const professionalCategoryOptions: DropdownOption[] = [
		{ value: 'Cadre', label: 'Cadre' },
		{ value: 'Employé', label: 'Employé' },
		{ value: 'Ouvrier', label: 'Ouvrier' },
		{ value: 'Profession libérale', label: 'Profession libérale' },
		{ value: 'Artisan', label: 'Artisan' },
		{ value: 'Commerçant', label: 'Commerçant' },
		{ value: 'Étudiant', label: 'Étudiant' },
		{ value: 'Retraité', label: 'Retraité' },
		{ value: 'Sans emploi', label: 'Sans emploi' },
		{ value: 'Autre', label: 'Autre' },
	];

	const handlePersonalSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const result = await updateProfile({
			firstName: personalForm.firstName,
			lastName: personalForm.lastName,
			birthDate: formatDateForAPI(personalForm.birthDate),
			gender: personalForm.gender,
			profession: personalForm.professionalCategory,
		});

		if (result.success) {
			showToast.success('Informations personnelles mises à jour avec succès');
			setIsEditingPersonal(false);
		} else {
			showToast.error('Erreur lors de la mise à jour des informations personnelles');
		}
	};

	const handleAddressSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const result = await updateProfile({
			address: addressForm.address,
			city: addressForm.city,
			zip: addressForm.zip,
		});

		if (result.success) {
			showToast.success('Adresse mise à jour avec succès');
			setIsEditingAddress(false);
		} else {
			showToast.error("Erreur lors de la mise à jour de l'adresse");
		}
	};

	const handlePasswordSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validate passwords match
		if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			showToast.error('Les mots de passe ne correspondent pas');
			return;
		}

		// Validate password strength
		if (passwordForm.newPassword.length < 8) {
			showToast.error('Le mot de passe doit contenir au moins 8 caractères');
			return;
		}

		const result = await changePassword({
			currentPassword: passwordForm.currentPassword,
			newPassword: passwordForm.newPassword,
		});

		if (result.success) {
			showToast.success('Mot de passe changé avec succès');
			setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
			setIsChangingPassword(false);
		} else {
			showToast.error('Erreur lors du changement de mot de passe');
		}
	};

	const handleAvatarUpload = async (file: File) => {
		// Validate file type
		if (!file.type.startsWith('image/')) {
			showToast.error('Veuillez sélectionner un fichier image valide.');
			return;
		}

		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			showToast.error('Le fichier est trop volumineux. Taille maximum : 5MB.');
			return;
		}

		const result = await uploadAvatar(file);
		if (result.success) {
			showToast.success('Avatar mis à jour avec succès');
		} else {
			showToast.error("Erreur lors de la mise à jour de l'avatar");
		}
	};



	const calculateAge = (birthDate: string) => {
		if (!birthDate) return null;
		const today = new Date();
		const birth = new Date(birthDate);
		let age = today.getFullYear() - birth.getFullYear();
		const monthDiff = today.getMonth() - birth.getMonth();
		if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
			age--;
		}
		return age;
	};

	if (!currentUser) {
		return (
			<div className="flex items-center justify-center min-h-96">
				<div className="text-center">
					<FaUser className="h-16 w-16 text-gray-300 mx-auto mb-4" />
					<h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun utilisateur connecté</h3>
					<p className="text-gray-600">Veuillez vous connecter pour accéder à votre profil.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
			>
				<h1 className="text-3xl font-bold text-gray-900 mb-2">Mon Profil</h1>
				<p className="text-gray-600 text-lg">
					Gérez vos informations personnelles et paramètres de compte
				</p>
			</motion.div>

			{/* Profile Header Card */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.1 }}
				className="bg-white border border-gray-100 rounded-2xl p-8"
			>
				<div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
					{/* Avatar */}
					<Avatar
						user={currentUser}
						size="xl"
						onAvatarUpload={handleAvatarUpload}
						loading={avatarLoading}
						showUploadButton={true}
					/>

					{/* User Info */}
					<div className="flex-1 text-center md:text-left">
						<h2 className="text-2xl font-bold text-gray-900 mb-2">
							{`${currentUser.firstName} ${currentUser.lastName}`}
						</h2>
						<p className="text-gray-600 mb-1">{currentUser.email}</p>
						{currentUser.professionalCategory && (
							<p className="text-gray-500 mb-4">{currentUser.professionalCategory}</p>
						)}

						<div className="flex flex-wrap gap-4 justify-center md:justify-start">
							{currentUser.birthDate && (
								<div className="flex items-center text-sm text-gray-600">
									<FaCalendarAlt className="h-4 w-4 mr-2" />
									{calculateAge(currentUser.birthDate)} ans
								</div>
							)}
							{currentUser.city && (
								<div className="flex items-center text-sm text-gray-600">
									<FaMapMarkerAlt className="h-4 w-4 mr-2" />
									{currentUser.city}
								</div>
							)}
							{currentUser.is_google_account && (
								<div className="flex items-center text-sm text-blue-600">
									<FaGoogle className="h-4 w-4 mr-2" />
									Compte Google
								</div>
							)}
						</div>
					</div>

					{/* Account Status */}
					<div className="flex flex-col space-y-2">
						<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
							<FaCheck className="h-3 w-3 mr-1" />
							Compte vérifié
						</span>
					</div>
				</div>
			</motion.div>

			{/* Personal Information */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.2 }}
				className="bg-white border border-gray-100 rounded-2xl p-6"
			>
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-xl font-semibold text-gray-900 flex items-center">
						<FaUser className="h-5 w-5 mr-3 text-[#1e51ab]" />
						Informations personnelles
					</h3>
					{!isEditingPersonal && (
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setIsEditingPersonal(true)}
							className="flex items-center"
						>
							<FaEdit className="h-4 w-4 mr-1" />
							Modifier
						</Button>
					)}
				</div>

				{isEditingPersonal ? (
					<form onSubmit={handlePersonalSubmit} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Input
								label="Prénom"
								type="text"
								value={personalForm.firstName}
								onChange={(e) => setPersonalForm({ ...personalForm, firstName: e.target.value })}
								required
							/>
							<Input
								label="Nom"
								type="text"
								value={personalForm.lastName}
								onChange={(e) => setPersonalForm({ ...personalForm, lastName: e.target.value })}
								required
							/>
							<Input
								label="Date de naissance"
								type="date"
								value={personalForm.birthDate}
								onChange={(e) => setPersonalForm({ ...personalForm, birthDate: e.target.value })}
							/>
							<Dropdown
								label="Genre"
								options={genderOptions}
								value={personalForm.gender}
								onChange={(value) => setPersonalForm({ ...personalForm, gender: value })}
								placeholder="Sélectionner"
							/>
							<div className="md:col-span-2">
								<Dropdown
									label="Catégorie professionnelle"
									options={professionalCategoryOptions}
									value={personalForm.professionalCategory}
									onChange={(value) =>
										setPersonalForm({ ...personalForm, professionalCategory: value })
									}
									placeholder="Sélectionner"
								/>
							</div>
						</div>
						<div className="flex space-x-3">
							<Button type="submit" className="flex items-center" disabled={profileLoading}>
								{profileLoading ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
										Enregistrement...
									</>
								) : (
									<>
										<FaSave className="h-4 w-4 mr-2" />
										Enregistrer
									</>
								)}
							</Button>
							<Button
								variant="secondary"
								type="button"
								onClick={() => setIsEditingPersonal(false)}
								className="flex items-center"
								disabled={profileLoading}
							>
								<FaTimes className="h-4 w-4 mr-2" />
								Annuler
							</Button>
						</div>
					</form>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<p className="text-sm text-gray-600 mb-1">Prénom</p>
							<p className="font-medium text-gray-900">
								{currentUser.firstName || 'Non renseigné'}
							</p>
						</div>
						<div>
							<p className="text-sm text-gray-600 mb-1">Nom</p>
							<p className="font-medium text-gray-900">{currentUser.lastName || 'Non renseigné'}</p>
						</div>
						<div>
							<p className="text-sm text-gray-600 mb-1">Date de naissance</p>
							<p className="font-medium text-gray-900">
								{currentUser.birthDate
									? new Date(currentUser.birthDate).toLocaleDateString('fr-FR')
									: 'Non renseigné'}
							</p>
						</div>
						<div>
							<p className="text-sm text-gray-600 mb-1">Genre</p>
							<p className="font-medium text-gray-900">{currentUser.gender || 'Non renseigné'}</p>
						</div>
						<div className="md:col-span-2">
							<p className="text-sm text-gray-600 mb-1">Catégorie professionnelle</p>
							<p className="font-medium text-gray-900">
								{currentUser.professionalCategory || 'Non renseigné'}
							</p>
						</div>
					</div>
				)}
			</motion.div>

			{/* Address Information */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.3 }}
				className="bg-white border border-gray-100 rounded-2xl p-6"
			>
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-xl font-semibold text-gray-900 flex items-center">
						<FaMapMarkerAlt className="h-5 w-5 mr-3 text-[#1e51ab]" />
						Adresse
					</h3>
					{!isEditingAddress && (
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setIsEditingAddress(true)}
							className="flex items-center"
						>
							<FaEdit className="h-4 w-4 mr-1" />
							Modifier
						</Button>
					)}
				</div>

				{isEditingAddress ? (
					<form onSubmit={handleAddressSubmit} className="space-y-4">
						<Input
							label="Adresse"
							type="text"
							value={addressForm.address}
							onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
							placeholder="123 Rue de la République"
						/>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Input
								label="Ville"
								type="text"
								value={addressForm.city}
								onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
								placeholder="Paris"
							/>
							<Input
								label="Code postal"
								type="text"
								value={addressForm.zip}
								onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
								placeholder="75001"
							/>
						</div>
						<div className="flex space-x-3">
							<Button type="submit" className="flex items-center" disabled={profileLoading}>
								{profileLoading ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
										Enregistrement...
									</>
								) : (
									<>
										<FaSave className="h-4 w-4 mr-2" />
										Enregistrer
									</>
								)}
							</Button>
							<Button
								variant="secondary"
								type="button"
								onClick={() => setIsEditingAddress(false)}
								className="flex items-center"
								disabled={profileLoading}
							>
								<FaTimes className="h-4 w-4 mr-2" />
								Annuler
							</Button>
						</div>
					</form>
				) : (
					<div className="space-y-4">
						<div>
							<p className="text-sm text-gray-600 mb-1">Adresse complète</p>
							<p className="font-medium text-gray-900">
								{currentUser.address || 'Non renseignée'}
								{currentUser.city && currentUser.address && <br />}
								{currentUser.city &&
									`${currentUser.zip ? currentUser.zip + ' ' : ''}${currentUser.city}`}
							</p>
						</div>
					</div>
				)}
			</motion.div>

			{/* Email and Security */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.4 }}
				className="bg-white border border-gray-100 rounded-2xl p-6"
			>
				<h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
					<FaLock className="h-5 w-5 mr-3 text-[#1e51ab]" />
					Sécurité et connexion
				</h3>

				<div className="space-y-6">
					{/* Email - Read Only */}
					<div className="border-b border-gray-100 pb-6">
						<div className="flex items-center justify-between mb-4">
							<h4 className="font-medium text-gray-900 flex items-center">
								<FaEnvelope className="h-4 w-4 mr-2" />
								Adresse email
							</h4>
						</div>
						<p className="text-gray-900">{currentUser.email}</p>
						<p className="text-sm text-gray-500 mt-1">
							L'adresse email ne peut pas être modifiée pour des raisons de sécurité.
						</p>
					</div>

					{/* Google Account */}
					{/* <div className="border-b border-gray-100 pb-6">
						<div className="flex items-center justify-between">
							<div>
								<h4 className="font-medium text-gray-900 flex items-center">
									<FaGoogle className="h-4 w-4 mr-2" />
									Compte Google
								</h4>
								<p className="text-sm text-gray-600 mt-1">
									{currentUser.is_google_account
										? 'Votre compte est lié à Google'
										: 'Liez votre compte Google pour une connexion rapide'}
								</p>
							</div>
							<Button
								variant={currentUser.is_google_account ? 'danger' : 'secondary'}
								size="sm"
								onClick={handleGoogleToggle}
							>
								{currentUser.is_google_account ? 'Dissocier' : 'Associer'}
							</Button>
						</div>
					</div> */}

					{/* Password */}
					<div>
						<div className="flex items-center justify-between mb-4">
							<h4 className="font-medium text-gray-900">Mot de passe</h4>
							{!isChangingPassword && (
								<Button variant="ghost" size="sm" onClick={() => setIsChangingPassword(true)}>
									Changer
								</Button>
							)}
						</div>

						{isChangingPassword ? (
							<form onSubmit={handlePasswordSubmit} className="space-y-4">
								<Input
									label="Mot de passe actuel"
									type="password"
									value={passwordForm.currentPassword}
									onChange={(e) =>
										setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
									}
									required
									disabled={passwordLoading}
								/>
								<Input
									label="Nouveau mot de passe"
									type="password"
									value={passwordForm.newPassword}
									onChange={(e) =>
										setPasswordForm({ ...passwordForm, newPassword: e.target.value })
									}
									required
									disabled={passwordLoading}
									helperText="Le mot de passe doit contenir au moins 8 caractères"
								/>
								<Input
									label="Confirmer le mot de passe"
									type="password"
									value={passwordForm.confirmPassword}
									onChange={(e) =>
										setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
									}
									required
									disabled={passwordLoading}
									error={
										passwordForm.newPassword &&
										passwordForm.confirmPassword &&
										passwordForm.newPassword !== passwordForm.confirmPassword
											? 'Les mots de passe ne correspondent pas'
											: undefined
									}
								/>
								<div className="flex space-x-3">
									<Button
										type="submit"
										size="sm"
										disabled={
											passwordLoading ||
											passwordForm.newPassword !== passwordForm.confirmPassword ||
											passwordForm.newPassword.length < 8
										}
									>
										{passwordLoading ? (
											<>
												<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
												Changement...
											</>
										) : (
											'Changer le mot de passe'
										)}
									</Button>
									<Button
										variant="secondary"
										size="sm"
										type="button"
										onClick={() => setIsChangingPassword(false)}
										disabled={passwordLoading}
									>
										Annuler
									</Button>
								</div>
							</form>
						) : (
							<p className="text-gray-600">••••••••</p>
						)}
					</div>
				</div>
			</motion.div>

			{/* Account Info */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.5 }}
				className="bg-gray-50 border border-gray-100 rounded-2xl p-6"
			>
				<h3 className="text-lg font-semibold text-gray-900 mb-4">Informations du compte</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
					<div>
						<p className="text-gray-600 mb-1">Membre depuis</p>
						<p className="font-medium text-gray-900">
							{currentUser.createdAt
								? new Date(currentUser.createdAt).toLocaleDateString('fr-FR')
								: 'Non disponible'}
						</p>
					</div>
					<div>
						<p className="text-gray-600 mb-1">Dernière modification</p>
						<p className="font-medium text-gray-900">
							{currentUser.updatedAt
								? new Date(currentUser.updatedAt).toLocaleDateString('fr-FR')
								: 'Non disponible'}
						</p>
					</div>
				</div>
			</motion.div>
		</div>
	);
};

export default ProfileModule;
