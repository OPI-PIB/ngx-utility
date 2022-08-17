import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

export interface TypedFormControl<T> extends FormControl {
	readonly value: T;
	readonly valueChanges: Observable<T>;

	setValue(
		value: T,
		options?: {
			onlySelf?: boolean;
			emitEvent?: boolean;
			emitModelToViewChange?: boolean;
			emitViewToModelChange?: boolean;
		},
	): void;

	patchValue(
		value: Partial<T>,
		options?: {
			onlySelf?: boolean;
			emitEvent?: boolean;
			emitModelToViewChange?: boolean;
			emitViewToModelChange?: boolean;
		},
	): void;
}
