import { FormControl } from '@angular/forms';

export type FormControlsOf<T> = {
	[P in keyof T]: FormControl<T[P]>;
}
