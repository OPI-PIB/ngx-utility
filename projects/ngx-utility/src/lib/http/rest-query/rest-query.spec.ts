import { fakeAsync, tick } from '@angular/core/testing';
import {
	catchError, map, Observable, of, timer,
} from 'rxjs';

import { RestQuery } from './rest-query';

class TestQuery extends RestQuery {
	constructor() {
		super();
	}

	get$<T>(options: {due: number, data: T}): Observable<T> {
		return this.query$(timer(options.due).pipe(map(() => options.data)));
	}

	getWithError$(options: { due: number }): Observable<unknown> {
		return this.query$(timer(options.due).pipe(map(() => { throw new Error(); })));
	}
}

describe('RestQuery', () => {
	it(`should show 'isProcessing' value on successful subscriptions`, fakeAsync(() => {
		const query = new TestQuery();
		let isProcessingValue: unknown = null;
		let getValue1: unknown = null;
		let getValue2: unknown = null;

		const queryIsProcessingSubscription = query.isProcessing$().subscribe((value) => {
			isProcessingValue = value;
		});

		expect(isProcessingValue).toBe(false);
		expect(getValue1).toBe(null);

		const queryGetSubscription1 = query.get$({ due: 2, data: 'value' }).subscribe((value) => {
			getValue1 = value;
		});

		tick(1);

		expect(isProcessingValue).toBe(true);
		expect(getValue1).toBe(null);

		tick(1);

		expect(isProcessingValue).toBe(false);
		expect(getValue1).toBe('value');
		expect(queryGetSubscription1.closed).toBe(true);
		expect(queryIsProcessingSubscription.closed).toBe(false);

		const queryGetSubscription2 = query.get$({ due: 2, data: 'value' }).subscribe((value) => {
			getValue2 = value;
		});

		tick(1);

		expect(isProcessingValue).toBe(true);
		expect(getValue2).toBe(null);

		tick(1);

		expect(isProcessingValue).toBe(false);
		expect(getValue2).toBe('value');
		expect(queryGetSubscription2.closed).toBe(true);
		expect(queryIsProcessingSubscription.closed).toBe(false);

		queryIsProcessingSubscription.unsubscribe();

		expect(queryIsProcessingSubscription.closed).toBe(true);
	}));

	it(`should show 'isProcessing' value on subscription with error`, fakeAsync(() => {
		const query = new TestQuery();
		let isProcessingValue: unknown = null;
		let getValue1: unknown = null;
		let getValue2: unknown = null;
		let getError1: unknown = null;

		const queryIsProcessingSubscription = query.isProcessing$().subscribe((value) => {
			isProcessingValue = value;
		});

		expect(isProcessingValue).toBe(false);
		expect(getValue1).toBe(null);

		const queryGetSubscription1 = query.getWithError$({ due: 2 }).pipe(
			catchError((error) => {
				getError1 = error;
				return of('Error');
			}),
		).subscribe((value) => {
			getValue1 = value;
		});

		tick(1);

		expect(isProcessingValue).toBe(true);
		expect(getError1).toBe(null);
		expect(getValue1).toBe(null);

		tick(1);

		expect(isProcessingValue).toBe(false);
		expect(getValue1).toBe('Error');
		expect(getError1 instanceof Error).toBe(true);
		expect(queryGetSubscription1.closed).toBe(true);
		expect(queryIsProcessingSubscription.closed).toBe(false);

		const queryGetSubscription2 = query.get$({ due: 2, data: 'value' }).subscribe((value) => {
			getValue2 = value;
		});

		tick(1);

		expect(isProcessingValue).toBe(true);
		expect(getValue2).toBe(null);

		tick(1);

		expect(isProcessingValue).toBe(false);
		expect(getValue2).toBe('value');
		expect(queryGetSubscription2.closed).toBe(true);
		expect(queryIsProcessingSubscription.closed).toBe(false);

		queryIsProcessingSubscription.unsubscribe();

		expect(queryIsProcessingSubscription.closed).toBe(true);
	}));

	it(`should show 'isProcessing' value on after unsubscribe`, fakeAsync(() => {
		const query = new TestQuery();
		let isProcessingValue: unknown = null;
		let getValue1: unknown = null;

		const queryIsProcessingSubscription = query.isProcessing$().subscribe((value) => {
			isProcessingValue = value;
		});

		expect(isProcessingValue).toBe(false);
		expect(getValue1).toBe(null);

		const queryGetSubscription1 = query.get$({ due: 2, data: 'value' }).subscribe((value) => {
			getValue1 = value;
		});

		tick(1);

		expect(isProcessingValue).toBe(true);
		expect(getValue1).toBe(null);

		queryGetSubscription1.unsubscribe();

		tick(1);

		expect(isProcessingValue).toBe(false);
		expect(getValue1).toBe(null);
		expect(queryGetSubscription1.closed).toBe(true);
		expect(queryIsProcessingSubscription.closed).toBe(false);

		queryIsProcessingSubscription.unsubscribe();

		expect(queryIsProcessingSubscription.closed).toBe(true);
	}));
});
