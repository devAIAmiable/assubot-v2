import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';

// Toast container component
export const ToastContainer = () => {
	return (
		<Toaster
			position="top-right"
			toastOptions={{
				duration: 4000,
			}}
		/>
	);
};

// Convenience functions for different toast types
export const showToast = {
	success: (message: string) => 
		toast.custom((t) => (
			<div
				className={`${
					t.visible ? 'animate-enter' : 'animate-leave'
				} max-w-md w-full bg-white shadow-xl rounded-lg pointer-events-auto flex`}
			>
				<div className="flex-1 w-0 p-4">
					<div className="flex items-start">
						<div className="flex-shrink-0 pt-0.5">
							<FaCheckCircle className="h-10 w-10 text-green-500" />
						</div>
						<div className="ml-3 flex-1">
							<p className="text-sm font-medium text-gray-900">
								Succès
							</p>
							<p className="mt-1 text-sm text-gray-500">
								{message}
							</p>
						</div>
					</div>
				</div>
				<div className="flex border-l border-gray-200">
					<button
						onClick={() => toast.dismiss(t.id)}
						className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					>
						Fermer
					</button>
				</div>
			</div>
		)),
	error: (message: string) => 
		toast.custom((t) => (
			<div
				className={`${
					t.visible ? 'animate-enter' : 'animate-leave'
				} max-w-md w-full bg-white shadow-xl rounded-lg pointer-events-auto flex`}
			>
				<div className="flex-1 w-0 p-4">
					<div className="flex items-start">
						<div className="flex-shrink-0 pt-0.5">
							<FaTimesCircle className="h-10 w-10 text-red-500" />
						</div>
						<div className="ml-3 flex-1">
							<p className="text-sm font-medium text-gray-900">
								Erreur
							</p>
							<p className="mt-1 text-sm text-gray-500">
								{message}
							</p>
						</div>
					</div>
				</div>
				<div className="flex border-l border-gray-200">
					<button
						onClick={() => toast.dismiss(t.id)}
						className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					>
						Fermer
					</button>
				</div>
			</div>
		)),
	info: (message: string) => 
		toast.custom((t) => (
			<div
				className={`${
					t.visible ? 'animate-enter' : 'animate-leave'
				} max-w-md w-full bg-white shadow-xl rounded-lg pointer-events-auto flex`}
			>
				<div className="flex-1 w-0 p-4">
					<div className="flex items-start">
						<div className="flex-shrink-0 pt-0.5">
							<FaInfoCircle className="h-10 w-10 text-blue-500" />
						</div>
						<div className="ml-3 flex-1">
							<p className="text-sm font-medium text-gray-900">
								Information
							</p>
							<p className="mt-1 text-sm text-gray-500">
								{message}
							</p>
						</div>
					</div>
				</div>
				<div className="flex border-l border-gray-200">
					<button
						onClick={() => toast.dismiss(t.id)}
						className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					>
						Fermer
					</button>
				</div>
			</div>
		)),
	warning: (message: string) => 
		toast.custom((t) => (
			<div
				className={`${
					t.visible ? 'animate-enter' : 'animate-leave'
				} max-w-md w-full bg-white shadow-xl rounded-lg pointer-events-auto flex`}
			>
				<div className="flex-1 w-0 p-4">
					<div className="flex items-start">
						<div className="flex-shrink-0 pt-0.5">
							<FaExclamationCircle className="h-10 w-10 text-yellow-500" />
						</div>
						<div className="ml-3 flex-1">
							<p className="text-sm font-medium text-gray-900">
								Attention
							</p>
							<p className="mt-1 text-sm text-gray-500">
								{message}
							</p>
						</div>
					</div>
				</div>
				<div className="flex border-l border-gray-200">
					<button
						onClick={() => toast.dismiss(t.id)}
						className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					>
						Fermer
					</button>
				</div>
			</div>
		)),
	loading: (message: string) => toast.loading(message),
	dismiss: (toastId?: string) => toast.dismiss(toastId),
};

export default ToastContainer;
