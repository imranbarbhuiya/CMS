'use client';

import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useEffect, useState } from 'react';

export const FallingParticles = ({
	fullScreen = true,
	color = '#fff',
	count = 50,
}: {
	readonly color?: string;
	readonly count?: number;
	readonly fullScreen?: boolean;
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
				className="pointer-events-none"
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
							speed: { min: 3, max: 5 },
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
