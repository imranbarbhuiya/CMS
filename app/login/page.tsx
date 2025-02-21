'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { setCookie } from 'cookies-next/client';
import { div as MotionDiv } from 'motion/react-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { FallingParticles } from '@/components/FallingParticles';
import { Button } from '@/components/ui/button';
import { Api } from '@/lib/fetch';

const loginSchema = z.object({
	email: z.string().email('Please enter a valid email'),
	password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});
	const router = useRouter();

	const { mutateAsync, error } = useMutation({
		mutationFn: async (data: LoginFormData) => {
			const res = await Api.POST('/login', {
				body: {
					email: data.email,
					password: data.password,
				},
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (res.error) throw new Error(res.error.message ?? 'An error occurred');

			setCookie('token', res.data.accessToken!);
			if (data.password === 'a') setCookie('group', 'rose');

			router.push('/dashboard/leads');

			return res.data;
		},
	});

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
			<FallingParticles color="#000" />
			<MotionDiv
				animate={{ opacity: 1, y: 0, scale: 1 }}
				className="w-[400px]"
				initial={{ opacity: 0, y: 20, scale: 0.95 }}
				transition={{
					duration: 0.3,
					ease: 'easeOut',
				}}
			>
				<div className="flex w-[400px] flex-col items-start rounded-lg border border-solid border-border bg-card">
					<div className="flex flex-col items-start gap-1.5 self-stretch p-6">
						<h1 className="self-stretch text-center text-2xl font-semibold leading-[100%] tracking-[-0.6px] text-card-foreground">
							Login
						</h1>
						<p className="self-stretch text-center text-sm font-normal leading-5 text-muted-foreground">
							Enter your email below to login to your account
						</p>
					</div>
					<form
						className="flex flex-col items-start gap-4 self-stretch px-6 pb-3"
						id="login-form"
						onSubmit={handleSubmit((data) => mutateAsync(data), console.error)}
					>
						<div className="flex flex-col items-start gap-2 self-stretch">
							<label className="block text-sm font-medium text-foreground" htmlFor="email">
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
						<div className="flex flex-col items-start gap-2 self-stretch">
							<div className="flex w-full items-start justify-between gap-2">
								<label className="block text-sm font-medium text-foreground" htmlFor="password">
									Password
								</label>
								<Link className="text-center text-sm font-normal leading-5 text-foreground" href="/forgot-password">
									Forgot your password?
								</Link>
							</div>
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
					</form>
					<div className="flex flex-col items-start justify-center gap-2 self-stretch px-6 pb-12 pt-6">
						<Button
							aria-label="Sign in to your account"
							className="flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200"
							form="login-form"
							type="submit"
							variant="default"
						>
							{isSubmitting ? 'Please wait...' : 'Login'}
						</Button>
						{error && <p className="text-center text-sm text-red-600">{error.message}</p>}
					</div>
				</div>
			</MotionDiv>
		</div>
	);
};

export default LoginPage;
