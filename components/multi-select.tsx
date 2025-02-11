import { Check, ChevronsUpDown, X } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface Option {
	label: string;
	value: string;
}

interface MultiSelectProps {
	readonly className?: string;
	readonly description?: string;
	readonly label?: string;
	readonly onChange: (values: string[]) => void;
	readonly options: Option[];
	readonly placeholder?: string;
	readonly selected: string[];
}

export function MultiSelect({
	options,
	selected,
	onChange,
	placeholder = 'Select options...',
	description,
	label,
	className,
}: MultiSelectProps) {
	const handleUnselect = (item: string) => {
		const newSelected = selected.filter((selectedItem) => selectedItem !== item);
		onChange(newSelected);
	};

	const handleSelect = (value: string) => {
		const newSelected = selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value];
		onChange(newSelected);
	};

	return (
		<div className="flex w-full flex-col gap-2">
			{label && <div className="text-sm font-medium">{label}</div>}
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
			<Popover>
				<PopoverTrigger asChild>
					<Button className={cn('w-full justify-between', className)} role="combobox" variant="outline">
						{selected.length === 0 ? (
							<span className="text-muted-foreground">{placeholder}</span>
						) : (
							<span>{`${selected.length} selected`}</span>
						)}
						<ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-full p-0">
					<Command>
						<CommandInput placeholder="Search options..." />
						<CommandList>
							<CommandEmpty>No option found.</CommandEmpty>
							<CommandGroup>
								{options.map((option) => (
									<CommandItem key={option.value} onSelect={() => handleSelect(option.value)} value={option.label}>
										{option.label}
										<Check
											className={cn('ml-auto size-4', selected.includes(option.value) ? 'opacity-100' : 'opacity-0')}
										/>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
			{description && <div className="text-sm text-muted-foreground">{description}</div>}
		</div>
	);
}
