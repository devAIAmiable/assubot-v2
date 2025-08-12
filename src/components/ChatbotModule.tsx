import { AnimatePresence, motion } from 'framer-motion';
import type { ChatMessage, ChatSession } from '../types';
import React, { useEffect, useRef, useState } from 'react';
import {
	addUserMessage,
	clearError,
	createNewSession,
	deleteSession,
	sendMessage,
	setSearchQuery,
	setSelectedContracts,
	switchSession,
	updateSessionTitle
} from '../store/chatSlice';
import {
	getChatIsTyping,
	getChatMessages,
	getChatQuickReplies,
	getChatSearchResults,
	getChatSessions,
	getChatState,
	getContracts,
	getCurrentChatSession,
	getSelectedContractIds,
	getUser
} from '../utils/stateHelpers';
import { getContractInsurer, getContractType } from '../utils/contractAdapters';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const ChatbotModule = () => {
	const dispatch = useAppDispatch();
	const user = useAppSelector(getUser);
	const messages = useAppSelector(getChatMessages);
	const isTyping = useAppSelector(getChatIsTyping);
	const quickReplies = useAppSelector(getChatQuickReplies);
	const chatState = useAppSelector(getChatState);
	const sessions = useAppSelector(getChatSessions);
	const currentSession = useAppSelector(getCurrentChatSession);
	const selectedContractIds = useAppSelector(getSelectedContractIds);
	const contracts = useAppSelector(getContracts);
	const searchResults = useAppSelector(getChatSearchResults);
	
	const [inputMessage, setInputMessage] = useState('');
	const [isInitialized, setIsInitialized] = useState(false);
	const [showSidebar, setShowSidebar] = useState(true);
	const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
	const [editingTitle, setEditingTitle] = useState('');
	const [showContractSelection, setShowContractSelection] = useState(false);
	const [tempSelectedContracts, setTempSelectedContracts] = useState<string[]>([]);
	const [tempChatTitle, setTempChatTitle] = useState('');
	const [searchQuery, setSearchQueryLocal] = useState('');
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// Initialize chat state on component mount (but don't create a session automatically)
	useEffect(() => {
		if (!isInitialized) {
			setIsInitialized(true);
		}
	}, [isInitialized]);

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages, isTyping]);

	// Focus input on mount and when quick reply is used
	useEffect(() => {
		inputRef.current?.focus();
	}, [quickReplies]);

	const handleSendMessage = async (message: string, payload?: string) => {
		if (!message.trim()) return;

		// Ensure we have a current session
		if (!currentSession) {
			dispatch(createNewSession({}));
		}

		// Add user message to state
		dispatch(addUserMessage(message));
		
		// Clear input if it's a typed message
		if (!payload) {
			setInputMessage('');
		}

		// Send message to bot with selected contracts context
		try {
			await dispatch(sendMessage({ 
				message, 
				payload, 
				contractIds: selectedContractIds.length > 0 ? selectedContractIds : undefined 
			}));
		} catch (error) {
			console.error('Error sending message:', error);
		}
	};

	const handleInputSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		handleSendMessage(inputMessage);
	};

	const handleQuickReply = (text: string, payload?: string) => {
		handleSendMessage(text, payload);
	};

	const handleSessionClick = (sessionId: string) => {
		dispatch(switchSession(sessionId));
		setShowSidebar(false);
	};

	const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		if (window.confirm('Êtes-vous sûr de vouloir supprimer cette conversation ?')) {
			dispatch(deleteSession(sessionId));
		}
	};



	const handleSearchChange = (query: string) => {
		setSearchQueryLocal(query);
		dispatch(setSearchQuery(query));
	};

	const handleEditTitle = (sessionId: string, currentTitle: string) => {
		setEditingSessionId(sessionId);
		setEditingTitle(currentTitle);
	};

	const handleSaveTitle = () => {
		if (editingSessionId && editingTitle.trim()) {
			dispatch(updateSessionTitle({ sessionId: editingSessionId, title: editingTitle.trim() }));
			setEditingSessionId(null);
			setEditingTitle('');
		}
	};

	const handleCancelEdit = () => {
		setEditingSessionId(null);
		setEditingTitle('');
	};

	const handleCreateNewSessionWithContracts = () => {
		dispatch(setSelectedContracts(tempSelectedContracts));
		dispatch(createNewSession({ title: tempChatTitle.trim() || undefined }));
		setShowContractSelection(false);
		setTempSelectedContracts([]);
		setTempChatTitle('');
	};

	const handleToggleTempContract = (contractId: string) => {
		setTempSelectedContracts(prev => 
			prev.includes(contractId) 
				? prev.filter(id => id !== contractId)
				: [...prev, contractId]
		);
	};

	const formatMessage = (content: string) => {
		// Convert basic markdown to HTML
		return content
			.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
			.replace(/\n/g, '<br>')
			.replace(/🔸/g, '•');
	};

	const formatTime = (timestamp: string) => {
		const date = new Date(timestamp);
		return date.toLocaleTimeString('fr-FR', { 
			hour: '2-digit', 
			minute: '2-digit' 
		});
	};

	const formatRelativeTime = (timestamp: string) => {
		const date = new Date(timestamp);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
		
		if (diffDays === 0) return 'Aujourd\'hui';
		if (diffDays === 1) return 'Hier';
		if (diffDays < 7) return `Il y a ${diffDays} jours`;
		return date.toLocaleDateString('fr-FR');
	};

	return (
		<div className="flex h-[calc(100vh-150px)] bg-white rounded-lg shadow-lg">
			{/* Contract Selection Modal */}
			<AnimatePresence>
				{showContractSelection && (
					<motion.div 
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
					>
						<motion.div 
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto"
						>
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold">Sélectionnez vos contrats</h3>
							<button
								onClick={() => setShowContractSelection(false)}
								className="text-gray-500 hover:text-gray-700"
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
						
						<p className="text-sm text-gray-600 mb-4">
							Choisissez un ou plusieurs contrats pour personnaliser votre conversation avec AI'A.
						</p>
						
						{/* Chat Title Input */}
						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Titre de la conversation (optionnel)
							</label>
							<input
								type="text"
								value={tempChatTitle}
								onChange={(e) => setTempChatTitle(e.target.value)}
								placeholder="Ex: Questions sur mon assurance auto..."
								className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent text-sm"
								style={{ '--tw-ring-color': '#1e51ab' } as React.CSSProperties}
							/>
						</div>
						
						<div className="space-y-2 mb-6">
							{contracts.map((contract) => (
								<div
									key={contract.id}
									onClick={() => handleToggleTempContract(contract.id)}
																	className={`p-3 rounded-lg cursor-pointer border transition-all duration-200 ${
									tempSelectedContracts.includes(contract.id)
										? 'shadow-sm ring-1'
										: 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
								}`}
								style={tempSelectedContracts.includes(contract.id) ? {
									backgroundColor: 'rgba(30, 81, 171, 0.05)',
									borderColor: 'rgba(30, 81, 171, 0.3)',
									boxShadow: '0 0 0 1px rgba(30, 81, 171, 0.2)'
								} : {}}
								>
									<div className="flex items-center space-x-3">
																			<div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
										tempSelectedContracts.includes(contract.id)
											? 'text-white'
											: 'border-gray-300'
									}`}
									style={tempSelectedContracts.includes(contract.id) ? {
										backgroundColor: '#1e51ab',
										borderColor: '#1e51ab'
									} : {}}>
											{tempSelectedContracts.includes(contract.id) && (
												<svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
													<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
												</svg>
											)}
										</div>
										<div className="flex-1">
											<p className="text-sm font-medium text-gray-900">{getContractType(contract)}</p>
											<p className="text-xs text-gray-500">{getContractInsurer(contract)} • {contract.status}</p>
										</div>
									</div>
								</div>
							))}
						</div>
						
						<div className="flex space-x-3">
							<button
								onClick={() => setShowContractSelection(false)}
								className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
							>
								Passer
							</button>
							<button
								onClick={handleCreateNewSessionWithContracts}
								className="flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors"
								style={{ backgroundColor: '#1e51ab' }}
							>
								Créer la conversation
							</button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>

			{/* Sidebar */}
			{showSidebar && (
				<div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col rounded-l-lg">
					{/* Sidebar Header */}
					<div className="p-4 border-b border-gray-200 bg-white rounded-tl-lg">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
							<button
								onClick={() => setShowSidebar(false)}
								className="text-gray-400 hover:text-gray-600 lg:hidden"
								title="Masquer le panneau"
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
						
						{/* Search Bar */}
						<div className="relative">
							<input
								type="text"
								placeholder="Rechercher dans les conversations..."
								value={searchQuery}
								onChange={(e) => handleSearchChange(e.target.value)}
								className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-9 focus:outline-none focus:ring-2 focus:border-transparent text-sm"
								style={{ 
									'--tw-ring-color': '#1e51ab' 
								} as React.CSSProperties}
							/>
							<svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
						</div>
					</div>

					{/* Sidebar Content */}
					<div className="flex-1 overflow-y-auto p-4">
						{/* New Chat Button */}
						<motion.button
							onClick={() => setShowContractSelection(true)}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="w-full text-white py-3 px-4 rounded-lg hover:opacity-90 flex items-center justify-center space-x-2 font-medium shadow-sm transition-all duration-200 mb-4"
							style={{ 
								background: 'linear-gradient(to right, #1e51ab, #1a4299)'
							}}
						>
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
							</svg>
							<span>Nouvelle conversation</span>
						</motion.button>
						
						{/* Search Results or Sessions */}
						{searchQuery.trim() ? (
							<div className="space-y-3">
								<p className="text-sm text-gray-600 font-medium">
									{searchResults.length} résultat(s) trouvé(s)
								</p>
								
								{searchResults.map((result) => (
									<div
										key={result.id}
										className="p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
									>
										<div className="text-xs text-gray-500 mb-1">
											{formatTime(result.timestamp)} • {result.sender === 'user' ? 'Vous' : 'AI\'A'}
										</div>
										<div 
											className="text-sm"
											dangerouslySetInnerHTML={{ 
												__html: formatMessage(result.content.replace(
													new RegExp(`(${searchQuery})`, 'gi'),
													'<mark class="bg-yellow-200">$1</mark>'
												))
											}}
										/>
									</div>
								))}
							</div>
						) : (
							<div className="space-y-3">
								{sessions.map((session: ChatSession) => (
									<div
										key={session.id}
										onClick={() => handleSessionClick(session.id)}
																			className={`p-3 rounded-lg cursor-pointer border transition-all duration-200 ${
										currentSession?.id === session.id
											? 'shadow-sm ring-1'
											: 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm'
									}`}
									style={currentSession?.id === session.id ? {
										backgroundColor: 'rgba(30, 81, 171, 0.05)',
										borderColor: 'rgba(30, 81, 171, 0.3)',
										boxShadow: '0 0 0 1px rgba(30, 81, 171, 0.2)'
									} : {}}
									>
										<div className="flex items-start justify-between">
											<div className="flex-1 min-w-0">
												{editingSessionId === session.id ? (
													<div className="flex items-center space-x-2 mb-2">
														<input
															type="text"
															value={editingTitle}
															onChange={(e) => setEditingTitle(e.target.value)}
															className="flex-1 text-sm font-medium border rounded px-2 py-1 focus:outline-none focus:ring-1"
															style={{
																borderColor: '#1e51ab',
																'--tw-ring-color': '#1e51ab'
															} as React.CSSProperties}
															onKeyDown={(e) => {
																if (e.key === 'Enter') handleSaveTitle();
																if (e.key === 'Escape') handleCancelEdit();
															}}
															autoFocus
														/>
														<button
															onClick={handleSaveTitle}
															className="text-green-600 hover:text-green-800"
														>
															<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
															</svg>
														</button>
														<button
															onClick={handleCancelEdit}
															className="text-red-500 hover:text-red-700"
														>
															<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
															</svg>
														</button>
													</div>
												) : (
													<div className="flex items-center space-x-2 mb-2">
														<p className="text-sm font-medium text-gray-900 truncate flex-1">
															{session.title}
														</p>
														<button
															onClick={(e) => {
																e.stopPropagation();
																handleEditTitle(session.id, session.title);
															}}
															className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
														>
															<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
															</svg>
														</button>
													</div>
												)}
												<p className="text-xs text-gray-500">
													{session.messageCount} messages • {formatRelativeTime(session.updatedAt)}
												</p>
												{session.selectedContractIds.length > 0 && (
													<p className="text-xs mt-1" style={{ color: '#1e51ab' }}>
														{session.selectedContractIds.length} contrat(s) sélectionné(s)
													</p>
												)}
											</div>
											<button
												onClick={(e) => handleDeleteSession(session.id, e)}
												className="text-gray-400 hover:text-red-500 ml-2"
											>
												×
											</button>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			)}

			{/* Main Chat Interface */}
			<div className={`flex flex-col flex-1 ${showSidebar ? '' : 'rounded-l-lg'}`}>
				{/* Header */}
				<div className="text-white p-4 rounded-t-lg" style={{ 
						background: 'linear-gradient(to right, #1e51ab, #1a4299)' 
					}}>
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<motion.div 
								className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
							>
								<span className="text-xl">🤖</span>
							</motion.div>
							<div className="flex-1 min-w-0">
								<div className="flex items-center space-x-2">
									<h1 className="text-lg font-semibold">AI'A</h1>
									{currentSession && (
										<span className="text-sm bg-white/20 px-2 py-1 rounded text-white/90">
											{currentSession.title}
										</span>
									)}
								</div>
								{currentSession && selectedContractIds.length > 0 ? (
									<p className="text-white/80 text-sm truncate">
										Contrats: {contracts
											.filter(c => selectedContractIds.includes(c.id))
											.map(c => getContractType(c))
											.join(', ')
										}
									</p>
								) : (
									<p className="text-white/80 text-sm">
										{user?.firstName 
											? `Salut ${user.firstName} ! Je suis votre assistant assurance.` 
											: 'Votre assistant assurance virtuel'
										}
									</p>
								)}
							</div>
						</div>
						
						<div className="flex items-center space-x-2">
							{/* Selected Contracts Indicator */}
							{selectedContractIds.length > 0 && (
								<div className="bg-white/20 px-3 py-1 rounded-full text-sm">
									{selectedContractIds.length} contrat(s)
								</div>
							)}
							
							{/* Toggle Sidebar Button */}
							<button
								onClick={() => setShowSidebar(!showSidebar)}
								className="p-2 hover:bg-white/20 rounded-lg"
								title={showSidebar ? "Masquer le panneau" : "Afficher le panneau"}
							>
								{showSidebar ? (
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7M19 19l-7-7 7-7" />
									</svg>
								) : (
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
									</svg>
								)}
							</button>
						</div>
					</div>
					
					{chatState.error && (
						<div className="mt-2 bg-red-500/20 border border-red-300 rounded px-3 py-2 text-sm">
							<div className="flex items-center justify-between">
								<span>{chatState.error}</span>
								<button 
									onClick={() => dispatch(clearError())}
									className="text-white hover:text-red-200"
								>
									×
								</button>
							</div>
						</div>
					)}
				</div>

				{/* Messages Container */}
				<div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
					{!currentSession ? (
						<div className="flex flex-col items-center justify-center h-full text-center">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className="bg-white rounded-lg p-8 shadow-sm border max-w-md"
							>
								<div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" 
									style={{ backgroundColor: 'rgba(30, 81, 171, 0.1)' }}>
									<svg className="w-8 h-8" style={{ color: '#1e51ab' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
									</svg>
								</div>
								<h3 className="text-lg font-semibold text-gray-900 mb-2">
									Aucune conversation active
								</h3>
								<p className="text-gray-600 text-sm mb-4">
									Créez une nouvelle conversation pour commencer à discuter avec AI'A.
								</p>
								<motion.button
									onClick={() => setShowContractSelection(true)}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="text-white py-2 px-4 rounded-lg hover:opacity-90 flex items-center space-x-2 font-medium transition-all duration-200"
									style={{ backgroundColor: '#1e51ab' }}
								>
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
									</svg>
									<span>Créer une conversation</span>
								</motion.button>
								<div className="text-xs text-gray-500 mt-3">
									💡 Vous pourrez sélectionner vos contrats pour des réponses personnalisées
								</div>
							</motion.div>
						</div>
					) : messages.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-full text-center">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className="bg-white rounded-lg p-8 shadow-sm border max-w-md"
							>
								<div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" 
									style={{ backgroundColor: 'rgba(30, 81, 171, 0.1)' }}>
									<svg className="w-8 h-8" style={{ color: '#1e51ab' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
									</svg>
								</div>
								<h3 className="text-lg font-semibold text-gray-900 mb-2">
									Bienvenue dans votre conversation ! 👋
								</h3>
								<p className="text-gray-600 text-sm mb-4">
									Commencez à taper votre message pour discuter avec AI'A. Je suis là pour vous aider avec vos questions d'assurance.
								</p>
								{selectedContractIds.length > 0 && (
									<div className="text-xs mt-3 p-2 rounded" style={{ 
										backgroundColor: 'rgba(30, 81, 171, 0.1)', 
										color: '#1e51ab' 
									}}>
										✓ {selectedContractIds.length} contrat(s) sélectionné(s) pour cette conversation
									</div>
								)}
							</motion.div>
						</div>
					) : (
						messages.map((message: ChatMessage) => (
						<motion.div
							key={message.id}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
						>
							<div className={`max-w-xs lg:max-w-md xl:max-w-lg p-3 ${
								message.sender === 'user' 
									? 'text-white rounded-l-lg rounded-tr-lg' 
									: 'bg-white text-gray-800 rounded-r-lg rounded-tl-lg shadow-sm border'
							}`}
							style={message.sender === 'user' ? { backgroundColor: '#1e51ab' } : {}}>
								<div 
									className="text-sm leading-relaxed"
									dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
								/>
								<div className={`text-xs mt-1 flex items-center justify-between ${
									message.sender === 'user' ? 'text-white/80' : 'text-gray-500'
								}`}>
									<span>{formatTime(message.timestamp)}</span>
									{message.contractIds && message.contractIds.length > 0 && (
										<span className="px-2 py-0.5 rounded text-xs" style={{
											backgroundColor: message.sender === 'user' ? 'rgba(255,255,255,0.2)' : 'rgba(30, 81, 171, 0.1)',
											color: message.sender === 'user' ? 'white' : '#1e51ab'
										}}>
											{message.contractIds.length} contrat(s)
										</span>
									)}
								</div>
							</div>
						</motion.div>
					)))}

					{/* Typing Indicator */}
					{isTyping && (
						<div className="flex justify-start">
							<div className="bg-white text-gray-800 rounded-r-lg rounded-tl-lg shadow-sm border p-3 flex items-center space-x-2">
								<div className="flex space-x-1">
									<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
									<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
									<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
								</div>
								<span className="text-sm text-gray-500">AI'A écrit...</span>
							</div>
						</div>
					)}

					<div ref={messagesEndRef} />
				</div>

				{/* Quick Replies */}
				{quickReplies.length > 0 && (
					<div className="px-4 pb-2">
						<div className="flex flex-wrap gap-2">
							{quickReplies.map((reply) => (
								<motion.button
									key={reply.id}
									onClick={() => handleQuickReply(reply.text, reply.payload)}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="text-sm px-3 py-1 rounded-full transition-colors duration-200 border"
									style={{
										backgroundColor: 'rgba(30, 81, 171, 0.1)',
										color: '#1e51ab',
										borderColor: 'rgba(30, 81, 171, 0.3)'
									}}
								>
									{reply.text}
								</motion.button>
							))}
						</div>
					</div>
				)}

				{/* Input Area */}
				{currentSession ? (
					<form onSubmit={handleInputSubmit} className="p-4 bg-white border-t rounded-b-lg">
						<div className="flex space-x-2">
							<input
								ref={inputRef}
								type="text"
								value={inputMessage}
								onChange={(e) => setInputMessage(e.target.value)}
								placeholder="Tapez votre message..."
								className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
								style={{ '--tw-ring-color': '#1e51ab' } as React.CSSProperties}
								disabled={isTyping}
							/>
							<motion.button
								type="submit"
								disabled={!inputMessage.trim() || isTyping}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
								style={{ 
									backgroundColor: !inputMessage.trim() || isTyping ? '#d1d5db' : '#1e51ab' 
								}}
							>
								<span>Envoyer</span>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
								</svg>
							</motion.button>
						</div>
					</form>
				) : (
					<div className="p-4 bg-gray-100 border-t rounded-b-lg">
						<div className="text-center text-gray-500 text-sm">
							Créez une conversation pour commencer à discuter
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ChatbotModule; 