import { AbstractControl, ControlContainer, FormGroup } from '@angular/forms';
import { always } from '@opi_pib/ts-utility';

export class FormConnector {
	private constructor() { }

	/**
	 * Set control as child of other form group
	 */
	static connectControlWithParent<T>(
		parent: ControlContainer,
		controlName: Extract<keyof T, string>,
		control: AbstractControl,
	): void {
		always(parent.control instanceof FormGroup, 'tdnqbykf');

		parent.control.setControl(controlName, control);
	}
}
