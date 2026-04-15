import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
	selector: 'app-filter-field',
	standalone: true,
	imports: [ReactiveFormsModule],
	templateUrl: './filter-field.component.html',
	styleUrl: './filter-field.component.css'
})
export class FilterFieldComponent {
	filterForm!: FormGroup;

	@Input() placeholderMessage: string = "Search field...";

	@Output() filterChange = new EventEmitter<string | null>();
	
	constructor(private fb: FormBuilder) {
		this.filterForm = this.fb.group({
			querySearch: ['', [Validators.minLength(3)]],
		})
	}

	applyFilter() {
		const value = this.filterForm.get("querySearch")?.value;

		if (this.filterForm.valid || !value) {
			this.filterChange.emit(value || null);
		}
	}

	clearFilter() {
		this.filterForm.reset();
		this.filterChange.emit(null);
	}
}
