import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { WINDOW } from './window';

describe('WINDOW', () => {
	it('injects global object', () => {
		TestBed.configureTestingModule({});

		expect(TestBed.inject(WINDOW)).toBe(window);
	});
});
