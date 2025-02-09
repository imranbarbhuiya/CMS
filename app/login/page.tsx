'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const loginSchema = z.object({
	email: z.string().email('Please enter a valid email'),
	password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (_data: LoginFormData) => {
		try {
			// TODO: Implement actual login logic here
		} catch (error) {
			console.error('Login failed:', error);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
			<div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
				<div className="text-center">
					<h1 className="mt-6 text-3xl font-bold text-gray-900">Login</h1>
					<p className="mt-2 text-sm text-gray-600">Enter your email below to login to your account</p>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700" htmlFor="email">
								Email
							</label>
							<input
								{...register('email')}
								autoComplete="email"
								className={`mt-1 block w-full border px-3 py-2 ${
									errors.email ? 'border-red-500' : 'border-gray-300'
								} rounded-md shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
								id="email"
								placeholder="m@example.com"
								type="email"
							/>
							{errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700" htmlFor="password">
								Password
							</label>
							<input
								{...register('password')}
								autoComplete="current-password"
								className={`mt-1 block w-full border px-3 py-2 ${
									errors.password ? 'border-red-500' : 'border-gray-300'
								} rounded-md shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
								id="password"
								type="password"
							/>
							{errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
						</div>
					</div>
					<div className="flex items-center justify-end">
						<Link
							className="text-sm text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
							href="/forgot-password"
						>
							Forgot your password?
						</Link>
					</div>
					<button
						aria-label="Sign in to your account"
						className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						type="submit"
					>
						Login
					</button>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;
