import React from 'react';
import zxcvbn from 'zxcvbn';

interface PasswordStrengthMeterProps {
	password: string;
	className?: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
	password,
	className = '',
}) => {
	const result = zxcvbn(password);
	const score = result.score; // 0-4

	// Custom validation rules
	const customRules = {
		hasUppercase: /[A-Z]/.test(password),
		hasLowercase: /[a-z]/.test(password),
		hasNumber: /\d/.test(password),
		hasSpecialChar: /[@$!%*#?&]/.test(password),
		hasMinLength: password.length >= 8,
	};

	const failedRules = Object.entries(customRules)
		.filter(([, passed]) => !passed)
		.map(([rule]) => rule);

	const getStrengthColor = (score: number, hasCustomIssues: boolean) => {
		// If custom rules fail, show red regardless of zxcvbn score
		if (hasCustomIssues) return 'bg-red-500';

		switch (score) {
			case 0:
			case 1:
				return 'bg-red-500';
			case 2:
				return 'bg-orange-500';
			case 3:
				return 'bg-yellow-500';
			case 4:
				return 'bg-green-500';
			default:
				return 'bg-gray-300';
		}
	};

	const getStrengthText = (score: number, hasCustomIssues: boolean) => {
		if (hasCustomIssues) return 'Critères non respectés';

		switch (score) {
			case 0:
				return 'Très faible';
			case 1:
				return 'Faible';
			case 2:
				return 'Moyen';
			case 3:
				return 'Bon';
			case 4:
				return 'Très bon';
			default:
				return '';
		}
	};

	const getCustomRuleMessage = (rule: string) => {
		switch (rule) {
			case 'hasUppercase':
				return 'Majuscule manquante';
			case 'hasLowercase':
				return 'Minuscule manquante';
			case 'hasNumber':
				return 'Chiffre manquant';
			case 'hasSpecialChar':
				return 'Caractère spécial manquant';
			case 'hasMinLength':
				return 'Trop court (min 8 caractères)';
			default:
				return '';
		}
	};

	if (!password) return null;

	const hasCustomIssues = failedRules.length > 0;

	return (
		<div className={`mt-2 ${className}`}>
			<div className="flex items-center justify-between mb-1">
				<span className="text-xs text-gray-600">Force du mot de passe :</span>
				<span
					className={`text-xs font-medium ${
						hasCustomIssues
							? 'text-red-600'
							: score >= 3
								? 'text-green-600'
								: score >= 2
									? 'text-yellow-600'
									: 'text-red-600'
					}`}
				>
					{getStrengthText(score, hasCustomIssues)}
				</span>
			</div>
			<div className="w-full bg-gray-200 rounded-full h-2">
				<div
					className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(score, hasCustomIssues)}`}
					style={{ width: `${((score + 1) / 5) * 100}%` }}
				/>
			</div>

			{/* Custom rules feedback */}
			{hasCustomIssues && (
				<div className="mt-2 space-y-1">
					{failedRules.map((rule) => (
						<p key={rule} className="text-xs text-red-600 flex items-center">
							<span className="mr-1">•</span>
							{getCustomRuleMessage(rule)}
						</p>
					))}
				</div>
			)}

			{/* Additional zxcvbn insights when custom rules pass */}
			{!hasCustomIssues && score < 3 && (
				<div className="mt-1 text-xs text-gray-500">
					<p>
						💡 Conseil :{' '}
						{result.feedback.suggestions[0] || 'Choisissez un mot de passe plus complexe'}
					</p>
				</div>
			)}
		</div>
	);
};

export default PasswordStrengthMeter;
