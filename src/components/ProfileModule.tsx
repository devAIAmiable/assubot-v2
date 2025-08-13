import {
	FaCalendarAlt,
	FaCheck,
	FaEdit,
	FaEnvelope,
	FaExclamationTriangle,
	FaGoogle,
	FaLock,
	FaMapMarkerAlt,
	FaSave,
	FaTimes,
	FaUser,
} from 'react-icons/fa';
import { useAppSelector } from '../store/hooks';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
import { formatDateForAPI, formatDateForInput, formatDateForDisplay } from '../utils/dateHelpers';
import { calculateAge } from '../utils/ageValidation';
import { showToast } from './ui/Toast';
import {
	personalInfoSchema,
	addressSchema,
	passwordChangeSchema,
	type PersonalInfoFormData,
	type AddressFormData,
	type PasswordChangeFormData,
} from '../schemas/profileValidation';

const ProfileModule = () => {
	const { currentUser } = useAppSelector(getUserState);
	const { updateProfile, loading: profileLoading } = useProfileUpdate();
	const { changePassword, loading: passwordLoading } = usePasswordChange();
	const { uploadAvatar, loading: avatarLoading } = useAvatarUpload();

	// Check if profile is incomplete by directly checking required fields
	const isProfileIncomplete =
		!currentUser?.birthDate || !currentUser?.gender || !currentUser?.professionalCategory;

	const [isEditingPersonal, setIsEditingPersonal] = useState(isProfileIncomplete);
	const [isEditingAddress, setIsEditingAddress] = useState(false);
	const [isChangingPassword, setIsChangingPassword] = useState(false);

	// Form states using React Hook Form with Zod validation
	const personalForm = useForm<PersonalInfoFormData>({
		resolver: zodResolver(personalInfoSchema),
		mode: 'onChange',
		defaultValues: {
			firstName: currentUser?.firstName || '',
			lastName: currentUser?.lastName || '',
			birthDate: formatDateForInput(currentUser?.birthDate),
			gender: currentUser?.gender || '',
			professionalCategory: currentUser?.professionalCategory || '',
		},
	});

	const addressForm = useForm<AddressFormData>({
		resolver: zodResolver(addressSchema),
		mode: 'onChange',
		defaultValues: {
			address: currentUser?.address || '',
			city: currentUser?.city || '',
			zip: currentUser?.zip || '',
		},
	});

	const passwordForm = useForm<PasswordChangeFormData>({
		resolver: zodResolver(passwordChangeSchema),
		mode: 'onChange',
		defaultValues: {
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		},
	});

	// Check if personal form is valid using form state
	const isPersonalFormValid = personalForm.formState.isValid;

	// Update form state when currentUser changes
	useEffect(() => {
		if (currentUser) {
			personalForm.reset({
				firstName: currentUser.firstName || '',
				lastName: currentUser.lastName || '',
				birthDate: formatDateForInput(currentUser.birthDate),
				gender: currentUser.gender || '',
				professionalCategory: currentUser.professionalCategory || '',
			});

			addressForm.reset({
				address: currentUser.address || '',
				city: currentUser.city || '',
				zip: currentUser.zip || '',
			});
		}
	}, [currentUser, personalForm, addressForm]);

	// Dropdown options
	const genderOptions: DropdownOption[] = [
		{ value: '', label: 'Sélectionner un genre' },
		{ value: 'male', label: 'Homme' },
		{ value: 'female', label: 'Femme' },
		{ value: 'other', label: 'Autre' },
	];

	const professionalCategoryOptions: DropdownOption[] = [
		{ value: '', label: 'Sélectionner une catégorie' },
		{ value: 'executive', label: 'Employé cadre' },
		{ value: 'non-executive', label: 'Employé non cadre' },
		{ value: 'entrepreneur', label: 'Entrepreneur' },
		{ value: 'student', label: 'Étudiant' },
		{ value: 'unemployed', label: 'Sans emploi' },
	];

	const handlePersonalSubmit = async (data: PersonalInfoFormData) => {
		// Déclencher la validation complète avant la soumission
		const isValid = await personalForm.trigger();
		
		if (!isValid) {
			// Les erreurs s'afficheront automatiquement grâce à formState.errors
			return;
		}

		const result = await updateProfile({
			firstName: data.firstName,
			lastName: data.lastName,
			birthDate: formatDateForAPI(data.birthDate),
			gender: data.gender,
			profession: data.professionalCategory,
		});

		if (result.success) {
			showToast.success('Informations personnelles mises à jour avec succès');
			setIsEditingPersonal(false);
		} else {
			showToast.error('Erreur lors de la mise à jour des informations personnelles');
		}
	};

	const handleAddressSubmit = async (data: AddressFormData) => {
		// Déclencher la validation complète avant la soumission
		const isValid = await addressForm.trigger();
		
		if (!isValid) {
			// Les erreurs s'afficheront automatiquement grâce à formState.errors
			return;
		}

		const result = await updateProfile({
			address: data.address,
			city: data.city,
			zip: data.zip,
		});

		if (result.success) {
			showToast.success('Adresse mise à jour avec succès');
			setIsEditingAddress(false);
		} else {
			showToast.error("Erreur lors de la mise à jour de l'adresse");
		}
	};

	const handlePasswordSubmit = async (data: PasswordChangeFormData) => {
		// Déclencher la validation complète avant la soumission
		const isValid = await passwordForm.trigger();
		
		if (!isValid) {
			// Les erreurs s'afficheront automatiquement grâce à formState.errors
			return;
		}

		const result = await changePassword({
			currentPassword: data.currentPassword,
			newPassword: data.newPassword,
		});

		if (result.success) {
			showToast.success('Mot de passe changé avec succès');
			passwordForm.reset();
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

			{/* Profile completion alert */}
			{isProfileIncomplete && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.1 }}
					className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
				>
					<div className="flex items-center">
						<FaExclamationTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
						<div className="ml-3 flex-1">
							<h3 className="text-sm font-medium text-yellow-900">Profil à compléter</h3>
							<p className="text-sm text-yellow-800 mt-1">
								Veuillez compléter :{' '}
								{[
									!currentUser?.birthDate && 'date de naissance',
									!currentUser?.gender && 'genre',
									!currentUser?.professionalCategory && 'catégorie professionnelle',
								]
									.filter(Boolean)
									.join(', ')}
							</p>
						</div>
					</div>
				</motion.div>
			)}

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
							{currentUser.isGoogleAccount && (
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
					<form onSubmit={personalForm.handleSubmit(handlePersonalSubmit)} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Input
								label="Prénom"
								type="text"
								{...personalForm.register('firstName')}
								required
								disabled={profileLoading}
								error={personalForm.formState.errors.firstName?.message}
							/>
							<Input
								label="Nom"
								type="text"
								{...personalForm.register('lastName')}
								required
								disabled={profileLoading}
								error={personalForm.formState.errors.lastName?.message}
							/>
							<Input
								label="Date de naissance"
								type="date"
								{...personalForm.register('birthDate')}
								required
								disabled={profileLoading}
								error={personalForm.formState.errors.birthDate?.message}
							/>
							<Controller
								name="gender"
								control={personalForm.control}
								render={({ field, fieldState }) => (
									<Dropdown
										label="Genre"
										options={genderOptions}
										value={field.value}
										onChange={field.onChange}
										placeholder="Sélectionner"
										disabled={profileLoading}
										error={fieldState.error?.message}
									/>
								)}
							/>
							<div className="md:col-span-2">
								<Controller
									name="professionalCategory"
									control={personalForm.control}
									render={({ field, fieldState }) => (
										<Dropdown
											label="Catégorie professionnelle"
											options={professionalCategoryOptions}
											value={field.value}
											onChange={field.onChange}
											placeholder="Sélectionner"
											disabled={profileLoading}
											error={fieldState.error?.message}
										/>
									)}
								/>
							</div>
						</div>
						<div className="flex space-x-3">
							<Button
								type="submit"
								className="flex items-center"
								disabled={profileLoading || !isPersonalFormValid}
							>
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
								onClick={() => {
									setIsEditingPersonal(false);
									personalForm.reset();
								}}
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
									? formatDateForDisplay(currentUser.birthDate)
									: 'Non renseigné'}
							</p>
						</div>
						<div>
							<p className="text-sm text-gray-600 mb-1">Genre</p>
							<p className="font-medium text-gray-900">
								{currentUser.gender === 'male'
									? 'Homme'
									: currentUser.gender === 'female'
										? 'Femme'
										: currentUser.gender === 'other'
											? 'Autre'
											: 'Non renseigné'}
							</p>
						</div>
						<div className="md:col-span-2">
							<p className="text-sm text-gray-600 mb-1">Catégorie professionnelle</p>
							<p className="font-medium text-gray-900">
								{currentUser.professionalCategory === 'executive'
									? 'Employé cadre'
									: currentUser.professionalCategory === 'non-executive'
										? 'Employé non cadre'
										: currentUser.professionalCategory === 'entrepreneur'
											? 'Entrepreneur'
											: currentUser.professionalCategory === 'student'
												? 'Étudiant'
												: currentUser.professionalCategory === 'unemployed'
													? 'Sans emploi'
													: 'Non renseigné'}
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
					<form onSubmit={addressForm.handleSubmit(handleAddressSubmit)} className="space-y-4">
						<Input
							label="Adresse"
							type="text"
							{...addressForm.register('address')}
							placeholder="123 Rue de la République"
							error={addressForm.formState.errors.address?.message}
						/>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Input
								label="Ville"
								type="text"
								{...addressForm.register('city')}
								placeholder="Paris"
								error={addressForm.formState.errors.city?.message}
							/>
							<Input
								label="Code postal"
								type="text"
								{...addressForm.register('zip')}
								placeholder="75001"
								error={addressForm.formState.errors.zip?.message}
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
								onClick={() => {
									setIsEditingAddress(false);
									addressForm.reset();
								}}
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
							<form
								onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
								className="space-y-4"
							>
								<Input
									label="Mot de passe actuel"
									type="password"
									{...passwordForm.register('currentPassword')}
									required
									disabled={passwordLoading}
									error={passwordForm.formState.errors.currentPassword?.message}
								/>
								<Input
									label="Nouveau mot de passe"
									type="password"
									{...passwordForm.register('newPassword')}
									required
									disabled={passwordLoading}
									helperText="Le mot de passe doit contenir au moins 8 caractères"
									error={passwordForm.formState.errors.newPassword?.message}
								/>
								<Input
									label="Confirmer le mot de passe"
									type="password"
									{...passwordForm.register('confirmPassword')}
									required
									disabled={passwordLoading}
									error={passwordForm.formState.errors.confirmPassword?.message}
								/>
								<div className="flex space-x-3">
									<Button
										type="submit"
										size="sm"
										disabled={passwordLoading || !passwordForm.formState.isValid}
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
										onClick={() => {
											setIsChangingPassword(false);
											passwordForm.reset();
										}}
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
