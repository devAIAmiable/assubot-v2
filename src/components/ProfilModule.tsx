import {
	FaCalendarAlt,
	FaCamera,
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
import {
	changePasswordSuccess,
	linkGoogleAccount,
	unlinkGoogleAccount,
	updateAddress,
	updateAvatar,
	updateEmail,
	updatePersonalInfo,
} from '../store/userSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

import { getUserState } from '../utils/stateHelpers';
import { motion } from 'framer-motion';
import { useState } from 'react';

const ProfilModule = () => {
	const dispatch = useAppDispatch();
	const { currentUser } = useAppSelector(getUserState);

	const [isEditingPersonal, setIsEditingPersonal] = useState(false);
	const [isEditingAddress, setIsEditingAddress] = useState(false);
	const [isEditingEmail, setIsEditingEmail] = useState(false);
	const [isChangingPassword, setIsChangingPassword] = useState(false);

	// Form states
	const [personalForm, setPersonalForm] = useState({
		first_name: currentUser?.first_name || '',
		last_name: currentUser?.last_name || '',
		birth_date: currentUser?.birth_date || '',
		gender: currentUser?.gender || '',
		professional_category: currentUser?.professional_category || '',
	});

	const [addressForm, setAddressForm] = useState({
		address: currentUser?.address || '',
		city: currentUser?.city || '',
		zipcode: currentUser?.zipcode || '',
	});

	const [emailForm, setEmailForm] = useState({
		email: currentUser?.email || '',
	});

	const [passwordForm, setPasswordForm] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});

	const handlePersonalSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		dispatch(updatePersonalInfo(personalForm));
		setIsEditingPersonal(false);
	};

	const handleAddressSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		dispatch(updateAddress(addressForm));
		setIsEditingAddress(false);
	};

	const handleEmailSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (emailForm.email !== currentUser?.email) {
			dispatch(updateEmail(emailForm.email));
		}
		setIsEditingEmail(false);
	};

	const handlePasswordSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (passwordForm.newPassword === passwordForm.confirmPassword) {
			// In a real app, this would call an API
			dispatch(changePasswordSuccess());
			setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
			setIsChangingPassword(false);
		}
	};

	const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const avatarUrl = URL.createObjectURL(file);
			dispatch(updateAvatar(avatarUrl));
		}
	};

	const handleGoogleToggle = () => {
		if (currentUser?.is_google_account) {
			dispatch(unlinkGoogleAccount());
		} else {
			dispatch(linkGoogleAccount());
		}
	};

	const getUserInitials = () => {
		if (currentUser) {
			const firstInitial = currentUser.first_name?.charAt(0) || '';
			const lastInitial = currentUser.last_name?.charAt(0) || '';
			return (firstInitial + lastInitial).toUpperCase() || 'U';
		}
		return 'U';
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
					<h3 className="text-lg font-semibold text-gray-900 mb-2">
						Aucun utilisateur connecté
					</h3>
					<p className="text-gray-600">
						Veuillez vous connecter pour accéder à votre profil.
					</p>
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
					<div className="relative">
						{currentUser.avatar ? (
							<img 
								src={currentUser.avatar} 
								alt="Avatar" 
								className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
							/>
						) : (
							<div className="w-24 h-24 bg-gradient-to-br from-[#1e51ab] to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg">
								{getUserInitials()}
							</div>
						)}
						<label className="absolute bottom-0 right-0 w-8 h-8 bg-[#1e51ab] rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-[#163d82] transition-colors shadow-lg">
							<FaCamera className="h-4 w-4" />
							<input 
								type="file" 
								accept="image/*" 
								onChange={handleAvatarUpload}
								className="hidden"
							/>
						</label>
					</div>

					{/* User Info */}
					<div className="flex-1 text-center md:text-left">
						<h2 className="text-2xl font-bold text-gray-900 mb-2">
							{currentUser.name || `${currentUser.first_name} ${currentUser.last_name}`}
						</h2>
						<p className="text-gray-600 mb-1">{currentUser.email}</p>
						{currentUser.professional_category && (
							<p className="text-gray-500 mb-4">{currentUser.professional_category}</p>
						)}
						
						<div className="flex flex-wrap gap-4 justify-center md:justify-start">
							{currentUser.birth_date && (
								<div className="flex items-center text-sm text-gray-600">
									<FaCalendarAlt className="h-4 w-4 mr-2" />
									{calculateAge(currentUser.birth_date)} ans
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
						{currentUser.is_first_time_login && (
							<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
								Première connexion
							</span>
						)}
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
						<button
							onClick={() => setIsEditingPersonal(true)}
							className="text-[#1e51ab] hover:text-[#163d82] text-sm font-medium flex items-center"
						>
							<FaEdit className="h-4 w-4 mr-1" />
							Modifier
						</button>
					)}
				</div>

				{isEditingPersonal ? (
					<form onSubmit={handlePersonalSubmit} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
								<input
									type="text"
									value={personalForm.first_name}
									onChange={(e) => setPersonalForm({ ...personalForm, first_name: e.target.value })}
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
								<input
									type="text"
									value={personalForm.last_name}
									onChange={(e) => setPersonalForm({ ...personalForm, last_name: e.target.value })}
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance</label>
								<input
									type="date"
									value={personalForm.birth_date}
									onChange={(e) => setPersonalForm({ ...personalForm, birth_date: e.target.value })}
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
								<select
									value={personalForm.gender}
									onChange={(e) => setPersonalForm({ ...personalForm, gender: e.target.value })}
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
								>
									<option value="">Sélectionner</option>
									<option value="Homme">Homme</option>
									<option value="Femme">Femme</option>
									<option value="Autre">Autre</option>
								</select>
							</div>
							<div className="md:col-span-2">
								<label className="block text-sm font-medium text-gray-700 mb-2">Catégorie professionnelle</label>
								<select
									value={personalForm.professional_category}
									onChange={(e) => setPersonalForm({ ...personalForm, professional_category: e.target.value })}
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
								>
									<option value="">Sélectionner</option>
									<option value="Cadre">Cadre</option>
									<option value="Employé">Employé</option>
									<option value="Ouvrier">Ouvrier</option>
									<option value="Profession libérale">Profession libérale</option>
									<option value="Artisan">Artisan</option>
									<option value="Commerçant">Commerçant</option>
									<option value="Étudiant">Étudiant</option>
									<option value="Retraité">Retraité</option>
									<option value="Sans emploi">Sans emploi</option>
									<option value="Autre">Autre</option>
								</select>
							</div>
						</div>
						<div className="flex space-x-3">
							<button
								type="submit"
								className="bg-[#1e51ab] text-white px-6 py-2 rounded-xl font-medium hover:bg-[#163d82] transition-colors flex items-center"
							>
								<FaSave className="h-4 w-4 mr-2" />
								Enregistrer
							</button>
							<button
								type="button"
								onClick={() => setIsEditingPersonal(false)}
								className="bg-gray-100 text-gray-700 px-6 py-2 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center"
							>
								<FaTimes className="h-4 w-4 mr-2" />
								Annuler
							</button>
						</div>
					</form>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<p className="text-sm text-gray-600 mb-1">Prénom</p>
							<p className="font-medium text-gray-900">{currentUser.first_name || 'Non renseigné'}</p>
						</div>
						<div>
							<p className="text-sm text-gray-600 mb-1">Nom</p>
							<p className="font-medium text-gray-900">{currentUser.last_name || 'Non renseigné'}</p>
						</div>
						<div>
							<p className="text-sm text-gray-600 mb-1">Date de naissance</p>
							<p className="font-medium text-gray-900">
								{currentUser.birth_date 
									? new Date(currentUser.birth_date).toLocaleDateString('fr-FR')
									: 'Non renseigné'
								}
							</p>
						</div>
						<div>
							<p className="text-sm text-gray-600 mb-1">Genre</p>
							<p className="font-medium text-gray-900">{currentUser.gender || 'Non renseigné'}</p>
						</div>
						<div className="md:col-span-2">
							<p className="text-sm text-gray-600 mb-1">Catégorie professionnelle</p>
							<p className="font-medium text-gray-900">{currentUser.professional_category || 'Non renseigné'}</p>
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
						<button
							onClick={() => setIsEditingAddress(true)}
							className="text-[#1e51ab] hover:text-[#163d82] text-sm font-medium flex items-center"
						>
							<FaEdit className="h-4 w-4 mr-1" />
							Modifier
						</button>
					)}
				</div>

				{isEditingAddress ? (
					<form onSubmit={handleAddressSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
							<input
								type="text"
								value={addressForm.address}
								onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
								className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
								placeholder="123 Rue de la République"
							/>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
								<input
									type="text"
									value={addressForm.city}
									onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
									placeholder="Paris"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Code postal</label>
								<input
									type="text"
									value={addressForm.zipcode}
									onChange={(e) => setAddressForm({ ...addressForm, zipcode: e.target.value })}
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
									placeholder="75001"
								/>
							</div>
						</div>
						<div className="flex space-x-3">
							<button
								type="submit"
								className="bg-[#1e51ab] text-white px-6 py-2 rounded-xl font-medium hover:bg-[#163d82] transition-colors flex items-center"
							>
								<FaSave className="h-4 w-4 mr-2" />
								Enregistrer
							</button>
							<button
								type="button"
								onClick={() => setIsEditingAddress(false)}
								className="bg-gray-100 text-gray-700 px-6 py-2 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center"
							>
								<FaTimes className="h-4 w-4 mr-2" />
								Annuler
							</button>
						</div>
					</form>
				) : (
					<div className="space-y-4">
						<div>
							<p className="text-sm text-gray-600 mb-1">Adresse complète</p>
							<p className="font-medium text-gray-900">
								{currentUser.address || 'Non renseignée'}
								{currentUser.city && currentUser.address && <br />}
								{currentUser.city && `${currentUser.zipcode ? currentUser.zipcode + ' ' : ''}${currentUser.city}`}
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
					{/* Email */}
					<div className="border-b border-gray-100 pb-6">
						<div className="flex items-center justify-between mb-4">
							<h4 className="font-medium text-gray-900 flex items-center">
								<FaEnvelope className="h-4 w-4 mr-2" />
								Adresse email
							</h4>
							{!isEditingEmail && (
								<button
									onClick={() => setIsEditingEmail(true)}
									className="text-[#1e51ab] hover:text-[#163d82] text-sm font-medium"
								>
									Modifier
								</button>
							)}
						</div>
						
						{isEditingEmail ? (
							<form onSubmit={handleEmailSubmit} className="space-y-4">
								<input
									type="email"
									value={emailForm.email}
									onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
									required
								/>
								<div className="flex space-x-3">
									<button
										type="submit"
										className="bg-[#1e51ab] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#163d82] transition-colors text-sm"
									>
										Enregistrer
									</button>
									<button
										type="button"
										onClick={() => setIsEditingEmail(false)}
										className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
									>
										Annuler
									</button>
								</div>
							</form>
						) : (
							<p className="text-gray-900">{currentUser.email}</p>
						)}
					</div>

					{/* Google Account */}
					<div className="border-b border-gray-100 pb-6">
						<div className="flex items-center justify-between">
							<div>
								<h4 className="font-medium text-gray-900 flex items-center">
									<FaGoogle className="h-4 w-4 mr-2" />
									Compte Google
								</h4>
								<p className="text-sm text-gray-600 mt-1">
									{currentUser.is_google_account 
										? 'Votre compte est lié à Google'
										: 'Liez votre compte Google pour une connexion rapide'
									}
								</p>
							</div>
							<button
								onClick={handleGoogleToggle}
								className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
									currentUser.is_google_account
										? 'bg-red-100 text-red-700 hover:bg-red-200'
										: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
								}`}
							>
								{currentUser.is_google_account ? 'Dissocier' : 'Associer'}
							</button>
						</div>
					</div>

					{/* Password */}
					<div>
						<div className="flex items-center justify-between mb-4">
							<h4 className="font-medium text-gray-900">Mot de passe</h4>
							{!isChangingPassword && (
								<button
									onClick={() => setIsChangingPassword(true)}
									className="text-[#1e51ab] hover:text-[#163d82] text-sm font-medium"
								>
									Changer
								</button>
							)}
						</div>
						
						{isChangingPassword ? (
							<form onSubmit={handlePasswordSubmit} className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel</label>
									<input
										type="password"
										value={passwordForm.currentPassword}
										onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
										className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
									<input
										type="password"
										value={passwordForm.newPassword}
										onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
										className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
									<input
										type="password"
										value={passwordForm.confirmPassword}
										onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
										className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
										required
									/>
								</div>
								<div className="flex space-x-3">
									<button
										type="submit"
										className="bg-[#1e51ab] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#163d82] transition-colors text-sm"
									>
										Changer le mot de passe
									</button>
									<button
										type="button"
										onClick={() => setIsChangingPassword(false)}
										className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
									>
										Annuler
									</button>
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
							{currentUser.created_at 
								? new Date(currentUser.created_at).toLocaleDateString('fr-FR')
								: 'Non disponible'
							}
						</p>
					</div>
					<div>
						<p className="text-gray-600 mb-1">Dernière modification</p>
						<p className="font-medium text-gray-900">
							{currentUser.updated_at 
								? new Date(currentUser.updated_at).toLocaleDateString('fr-FR')
								: 'Non disponible'
							}
						</p>
					</div>
					{/* <div>
						<p className="text-gray-600 mb-1">ID utilisateur</p>
						<p className="font-mono text-xs bg-white px-2 py-1 rounded border">{currentUser.id}</p>
					</div> */}
					<div>
						<p className="text-gray-600 mb-1">Type de compte</p>
						<p className="font-medium text-gray-900">
							{currentUser.is_google_account ? 'Google' : 'Standard'}
						</p>
					</div>
				</div>
			</motion.div>
		</div>
	);
};

export default ProfilModule; 