import { NgZone } from '@angular/core';
import { asyncScheduler, SchedulerLike, Subscription } from 'rxjs';

import { BaseNgZoneScheduler } from './base-ng-zone-scheduler';

class EnterSchedulerBase extends BaseNgZoneScheduler {
	public schedule(...args: any): Subscription {
		// eslint-disable-next-line prefer-spread
		return this.ngZone.run(() => this.scheduler.schedule.apply(this.scheduler, args));
	}
}

/**
 * Enter NgZone inside observable
 *
 * Example:
 * of(1).pipe(observeOn(enterNgZone(this.ngZone))).subscribe()
 */
export function enterNgZone(ngZone: NgZone, scheduler: SchedulerLike = asyncScheduler): SchedulerLike {
	return new EnterSchedulerBase(ngZone, scheduler);
}
