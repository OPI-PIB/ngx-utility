import { any } from 'ramda';
import {
	BehaviorSubject, combineLatest, finalize, map, Observable,
} from 'rxjs';

export abstract class RestQuery {
	#isProcessing$ = new BehaviorSubject(false);

	static isProcessingAny$(sources$: Observable<boolean>[]): Observable<boolean> {
		return combineLatest(sources$).pipe(map((states) => any((state) => state === true, states)));
	}

	constructor() { }

	isProcessing$(): Observable<boolean> {
		return this.#isProcessing$.asObservable();
	}

	protected query$<Response>(request$: Observable<Response>): Observable<Response> {
		this.#isProcessing$.next(true);

		return request$.pipe(
			finalize(() => this.#isProcessing$.next(false)),
		);
	}
}
