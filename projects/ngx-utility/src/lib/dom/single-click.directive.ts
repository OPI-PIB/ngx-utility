import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
	selector: '[singleClick]',
	standalone: true,
})
export class SingleClickDirective {
	constructor(private el: ElementRef) {}

	@HostListener('click', ['$event'])
	handleClick(event: Event) {
		if (this.el.nativeElement.disabled) {
			event.preventDefault();
			event.stopImmediatePropagation();
		} else {
			this.el.nativeElement.disabled = true;
		}
	}

	enable(): void {
		this.el.nativeElement.disabled = false;
	}
}
