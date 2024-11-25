import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
	selector: '[singleClick]',
	standalone: true,
})
export class SingleClickDirective {
	constructor(private el: ElementRef) {}

	@HostListener('click', ['$event'])
	handleClick(event: Event) {
		if (this.disabled) {
			event.preventDefault();
			event.stopImmediatePropagation();
		} else {
			this.disable();
		}
	}

	enable(): void {
		this.el.nativeElement.disabled = false;
	}

	disable(): void {
		this.el.nativeElement.disable = true;
	}

	get disabled(): boolean {
		return this.el.nativeElement.disabled;
	}
}
