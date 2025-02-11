import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PaginationProps {
	readonly currentPage: number;
	readonly itemsPerPage: number;
	readonly onItemsPerPageChange?: (value: number) => void;
	readonly onPageChange: (page: number) => void;
	readonly totalPages: number;
}

export const Pagination = ({
	currentPage,
	totalPages,
	onPageChange,
	itemsPerPage,
	onItemsPerPageChange,
}: PaginationProps) => {
	const isFirstPage = currentPage === 1;
	const isLastPage = currentPage === totalPages;

	const handleFirstPage = () => onPageChange(1);
	const handlePreviousPage = () => onPageChange(currentPage - 1);
	const handleNextPage = () => onPageChange(currentPage + 1);
	const handleLastPage = () => onPageChange(totalPages);

	return (
		<div className="flex flex-col items-center justify-center gap-8 px-2 py-4 md:flex-row">
			{onItemsPerPageChange ? (
				<div className="flex items-center space-x-2">
					<p className="text-sm font-medium">Rows per page</p>
					<Select
						onValueChange={(value) => {
							onItemsPerPageChange(Number(value));
						}}
						value={itemsPerPage.toString()}
					>
						<SelectTrigger className="w-16">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{[5, 10, 20, 30, 40, 50].map((pageSize) => (
								<SelectItem key={pageSize} value={pageSize.toString()}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			) : null}
			<div className="flex items-center justify-center gap-8">
				<p className="text-sm font-medium">
					Page {currentPage} of {totalPages}
				</p>
				<div className="flex items-center space-x-1">
					<Button disabled={isFirstPage} onClick={handleFirstPage} size="icon" variant="outline">
						<ChevronsLeft className="size-4" />
					</Button>
					<Button disabled={isFirstPage} onClick={handlePreviousPage} size="icon" variant="outline">
						<ChevronLeft className="size-4" />
					</Button>
					<Button disabled={isLastPage} onClick={handleNextPage} size="icon" variant="outline">
						<ChevronRight className="size-4" />
					</Button>
					<Button disabled={isLastPage} onClick={handleLastPage} size="icon" variant="outline">
						<ChevronsRight className="size-4" />
					</Button>
				</div>
			</div>
		</div>
	);
};
