import { FormArray } from '@angular/forms';
import { Observable } from 'rxjs';

export interface TypedFormArray<T> extends FormArray {
	readonly value: T[];
	readonly valueChanges: Observable<T[]>;

	setValue(
		value: T[],
		options?: {
			onlySelf?: boolean;
			emitEvent?: boolean;
		},
	): void;

	patchValue(
		value: Partial<T>[],
		options?: {
			onlySelf?: boolean;
			emitEvent?: boolean;
		},
	): void;

	getRawValue(): T[];
}
