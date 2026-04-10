import { Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { PaginationMetadata, PaginationParameters } from '../../../models/paged-result';
import { User } from '../../../models/user';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-pagination',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './pagination.component.html',
	styleUrl: './pagination.component.css'
})
export class PaginationComponent {
	@Input() paginationMetadata = signal<PaginationMetadata | null>(null);
	@Input() pageSizeOptions = [8, 12, 24];
	@Input() paginationParameters!: PaginationParameters

	@Output() confirm = new EventEmitter<PaginationParameters>();

	visiblePages = computed(() => {
		const meta = this.paginationMetadata();
		if (!meta || meta.totalPages <= 1) return meta?.totalPages === 1 ? [1] : [];

		const current = meta.currentPage;
		const last = meta.totalPages;

		const delta = 1;
		const range: number[] = [];

		range.push(1);

		for (let i = Math.max(2, current - delta); i <= Math.min(last - 1, current + delta); i++) {
			range.push(i);
		}

		range.push(last);

		const pagesWithEllipsis: (number | string)[] = [];
		let l: number | undefined;

		for (const i of [...new Set(range)].sort((a, b) => a - b)) {
			if (l !== undefined) {
				if (i - l === 2) {
					pagesWithEllipsis.push(l + 1);
				} else if (i - l > 2) {
					pagesWithEllipsis.push('...');
				}
			}
			pagesWithEllipsis.push(i);
			l = i;
		}

		return pagesWithEllipsis;
	});

	goToPage(page: number | string) {
		if (typeof page === 'number' && this.paginationParameters) {
			this.paginationParameters.pageNumber = page;
		}
		this.confirm.emit(this.paginationParameters);
	}

	nextPage() {
		if (this.paginationMetadata()?.hasNext) {
			if (this.paginationParameters) {
				this.paginationParameters.pageNumber++;
			}

			this.confirm.emit(this.paginationParameters);
		}
	}

	prevPage() {
		if (this.paginationMetadata()?.hasPrevious && this.paginationParameters.pageNumber > 1) {
			if (this.paginationParameters) {
				this.paginationParameters.pageNumber--;
			}

			this.confirm.emit(this.paginationParameters);
		}
	}

	onPageSizeChange(pageSize: number) {
		if (this.paginationParameters) {
			this.paginationParameters.pageSize = pageSize;
			this.paginationParameters.pageNumber = 1;
		}

		this.confirm.emit(this.paginationParameters);
	}
}
