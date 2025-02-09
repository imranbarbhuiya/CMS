import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const sports = [
	'Basketball',
	'Darts',
	'GAA',
	'Pool',
	'Rugby',
	'Soccer',
	'American Football',
	'Hockey',
	'Badminton',
	'Squash',
	'Handball',
	'Counters',
	'Aussie Rules',
	'Tennis',
	'Padel',
	'Pickleball',
	'Ping Pong',
];
