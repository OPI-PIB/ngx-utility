import { AbstractControl, ControlContainer, FormGroup } from '@angular/forms';
import { always } from '@opi-pib/ts-utility';

export class FormConnector {
	private constructor() { }

	/**
	 * Set control as child of other form group
	 */
	static connectControlWithParent(parent: ControlContainer, controlName: string, control: AbstractControl): void {
		always(parent.control instanceof FormGroup, 'parent.control needs to be instance of FormGroup');

		parent.control.setControl(controlName, control);
	}
}
