import { X } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

import type { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu';

export interface Option {
	label: string;
	value: string;
}

interface MultiSelectProps {
	readonly className?: string;
	readonly onChange: (values: string[]) => void;
	readonly options: Option[];
	readonly placeholder?: string;
	readonly selected: string[];
}

export function MultiSelect({
	options,
	selected,
	onChange,
	placeholder = 'Select items...',
	className,
}: MultiSelectProps) {
	const handleUnselect = (item: string) => {
		onChange(selected.filter((selectedItem) => selectedItem !== item));
	};

	const handleCheckedChange = (value: string, checked: DropdownMenuCheckboxItemProps['checked']) => {
		if (checked) onChange([...selected, value]);
		else onChange(selected.filter((item) => item !== value));
	};

	return (
		<div className="flex w-full flex-col gap-2">
			{selected.length > 0 && (
				<div className="flex flex-wrap gap-1">
					{selected.map((item) => {
						const option = options.find((currentOption) => currentOption.value === item);
						return (
							<Badge className="flex items-center gap-1" key={item} variant="secondary">
								{option?.label}
								<button
									className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
									onClick={() => handleUnselect(item)}
									onKeyDown={(event) => {
										if (event.key === 'Enter') handleUnselect(item);
									}}
									onMouseDown={(event) => {
										event.preventDefault();
										event.stopPropagation();
									}}
									type="button"
								>
									<X className="size-3 text-muted-foreground hover:text-foreground" />
								</button>
							</Badge>
						);
					})}
				</div>
			)}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button className={cn('w-full justify-start text-left font-normal', className)} variant="outline">
						{selected.length === 0 ? (
							<span className="text-muted-foreground">{placeholder}</span>
						) : (
							<span>{`${selected.length} selected`}</span>
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start" className="w-56">
					<DropdownMenuLabel>Options</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{options.map((option) => (
						<DropdownMenuCheckboxItem
							checked={selected.includes(option.value)}
							key={option.value}
							onCheckedChange={(checked) => handleCheckedChange(option.value, checked)}
						>
							{option.label}
						</DropdownMenuCheckboxItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
