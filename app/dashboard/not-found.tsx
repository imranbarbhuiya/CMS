import Image from 'next/image';

import notFoundImage from '../404.png';

export default function NotFound() {
	return (
		<div className="flex h-screen flex-col items-center justify-center gap-1.5">
			<Image alt="404" src={notFoundImage} />
			<p className="text-2xl font-medium leading-8 tracking-[-0.6px] text-primary">Something went wrong!</p>
		</div>
	);
}
