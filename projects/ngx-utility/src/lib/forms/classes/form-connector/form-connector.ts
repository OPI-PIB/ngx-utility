import { AbstractControl, ControlContainer, FormGroup } from '@angular/forms';

export class FormConnector {
	private constructor() { }

	/**
	 * Set control as child of other form group
	 */
	static connectControlWithParent(parent: ControlContainer, controlName: string, control: AbstractControl): void {
		(parent.control as FormGroup).setControl(controlName, control);
	}
}
