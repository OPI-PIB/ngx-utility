import { catchError, map, Observable, of, timer } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';

import { RestQuery } from './rest-query';

class TestQuery extends RestQuery {
	get$<T>(options: { due: number; data: T }): Observable<T> {
		return this.query$(timer(options.due).pipe(map(() => options.data)));
	}

	getWithError$(options: { due: number }): Observable<unknown> {
		return this.query$(
			timer(options.due).pipe(
				map(() => {
					throw new Error();
				})
			)
		);
	}
}

describe('RestQuery (Vitest)', () => {
	it(`should show 'isProcessing' value on successful subscriptions`, async () => {
		vi.useFakeTimers();

		const query = new TestQuery();
		let isProcessingValue: unknown = null;
		let getValue1: unknown = null;
		let getValue2: unknown = null;

		const queryIsProcessingSubscription = query.isProcessing$().subscribe((value) => {
			isProcessingValue = value;
		});

		expect(isProcessingValue).toBe(false);

		const queryGetSubscription1 = query.get$({ due: 2, data: 'value' }).subscribe((value) => (getValue1 = value));

		await vi.advanceTimersByTimeAsync(1);
		expect(isProcessingValue).toBe(true);
		expect(getValue1).toBe(null);

		await vi.advanceTimersByTimeAsync(1);
		expect(isProcessingValue).toBe(false);
		expect(getValue1).toBe('value');
		expect(queryGetSubscription1.closed).toBe(true);

		const queryGetSubscription2 = query.get$({ due: 2, data: 'value' }).subscribe((value) => (getValue2 = value));

		await vi.advanceTimersByTimeAsync(1);
		expect(isProcessingValue).toBe(true);
		expect(getValue2).toBe(null);

		await vi.advanceTimersByTimeAsync(1);
		expect(isProcessingValue).toBe(false);
		expect(getValue2).toBe('value');
		expect(queryGetSubscription2.closed).toBe(true);
		expect(queryIsProcessingSubscription.closed).toBe(false);

		queryIsProcessingSubscription.unsubscribe();
		expect(queryIsProcessingSubscription.closed).toBe(true);
	});

	it(`should show 'isProcessing' value on subscription with error`, async () => {
		vi.useFakeTimers();

		const query = new TestQuery();
		let isProcessingValue: unknown = null;
		let getValue1: unknown = null;
		let getValue2: unknown = null;
		let getError1: unknown = null;

		const queryIsProcessingSubscription = query.isProcessing$().subscribe((value) => {
			isProcessingValue = value;
		});

		expect(isProcessingValue).toBe(false);

		const queryGetSubscription1 = query
			.getWithError$({ due: 2 })
			.pipe(
				catchError((err) => {
					getError1 = err;
					return of('Error');
				})
			)
			.subscribe((value) => (getValue1 = value));

		await vi.advanceTimersByTimeAsync(1);
		expect(isProcessingValue).toBe(true);
		expect(getError1).toBe(null);
		expect(getValue1).toBe(null);

		await vi.advanceTimersByTimeAsync(1);
		expect(isProcessingValue).toBe(false);
		expect(getValue1).toBe('Error');
		expect(getError1).toBeInstanceOf(Error);
		expect(queryGetSubscription1.closed).toBe(true);

		const queryGetSubscription2 = query.get$({ due: 2, data: 'value' }).subscribe((v) => (getValue2 = v));

		await vi.advanceTimersByTimeAsync(1);
		expect(isProcessingValue).toBe(true);

		await vi.advanceTimersByTimeAsync(1);
		expect(isProcessingValue).toBe(false);
		expect(getValue2).toBe('value');
		expect(queryGetSubscription2.closed).toBe(true);
		expect(queryIsProcessingSubscription.closed).toBe(false);

		queryIsProcessingSubscription.unsubscribe();
		expect(queryIsProcessingSubscription.closed).toBe(true);
	});

	it(`should show 'isProcessing' value after unsubscribe`, async () => {
		vi.useFakeTimers();

		const query = new TestQuery();
		let isProcessingValue: unknown = null;
		let getValue1: unknown = null;

		const queryIsProcessingSubscription = query.isProcessing$().subscribe((v) => {
			isProcessingValue = v;
		});

		expect(isProcessingValue).toBe(false);

		const queryGetSubscription1 = query.get$({ due: 2, data: 'value' }).subscribe((v) => (getValue1 = v));

		await vi.advanceTimersByTimeAsync(1);
		expect(isProcessingValue).toBe(true);

		queryGetSubscription1.unsubscribe();
		await vi.advanceTimersByTimeAsync(1);

		expect(isProcessingValue).toBe(false);
		expect(getValue1).toBe(null);
		expect(queryGetSubscription1.closed).toBe(true);
		expect(queryIsProcessingSubscription.closed).toBe(false);

		queryIsProcessingSubscription.unsubscribe();
		expect(queryIsProcessingSubscription.closed).toBe(true);
	});
});
