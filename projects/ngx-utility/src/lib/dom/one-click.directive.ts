import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
	selector: '[singleClick]',
	standalone: true,
})
export class SingleClickDirective {
	#isClicked = false;

	constructor(private el: ElementRef) {}

	@HostListener('click', ['$event'])
	handleClick(event: Event) {
		if (this.#isClicked) {
			event.preventDefault();
			event.stopImmediatePropagation();
		} else {
			this.#isClicked = true;
			this.el.nativeElement.disabled = true;
		}
	}
}
