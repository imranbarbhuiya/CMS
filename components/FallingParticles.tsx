'use client';

import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

export const FallingParticles = ({
	fullScreen = true,
	color = '#fff',
	count = 50,
	className,
	speed = 3,
}: {
	readonly className?: string;
	readonly color?: string;
	readonly count?: number;
	readonly fullScreen?: boolean;
	readonly speed?: number;
}) => {
	const [init, setInit] = useState(false);

	useEffect(() => {
		void initParticlesEngine(async (engine) => {
			await loadSlim(engine);
			// eslint-disable-next-line promise/prefer-await-to-then
		}).then(() => {
			setInit(true);
		});
	}, []);

	return (
		init && (
			<Particles
				className={clsx('pointer-events-none', className)}
				options={{
					particles: {
						color: {
							value: color,
						},
						number: {
							value: count,
						},
						opacity: {
							value: { min: 0.3, max: 1 },
						},
						shape: {
							type: 'circle',
						},
						size: {
							value: { min: 0.5, max: 3 },
						},
						move: {
							direction: 'bottom-right',
							enable: true,
							speed: { min: speed, max: speed + 2 },
							straight: true,
						},
					},
					fullScreen: {
						enable: fullScreen,
					},
				}}
			/>
		)
	);
};
