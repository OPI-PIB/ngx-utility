import { TestBed } from '@angular/core/testing';

import { WINDOW } from './window';

describe('WINDOW', () => {
	it('injects global object', () => {
		TestBed.configureTestingModule({});

		expect(TestBed.inject(WINDOW)).toBe(window);
	});
});
