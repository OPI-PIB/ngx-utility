import { NgZone } from '@angular/core';
import { asyncScheduler, SchedulerLike, Subscription } from 'rxjs';

import { BaseNgZoneScheduler } from './base-ng-zone-scheduler';

class LeaveSchedulerBase extends BaseNgZoneScheduler {
	public schedule(...args: any): Subscription {
		// eslint-disable-next-line prefer-spread
		return this.ngZone.runOutsideAngular(() => this.scheduler.schedule.apply(this.scheduler, args));
	}
}

/**
 * Leave NgZone inside observable
 *
 * Example:
 * of(1).pipe(observeOn(leaveNgZone(this.ngZone))).subscribe()
 */
export function leaveNgZone(ngZone: NgZone, scheduler: SchedulerLike = asyncScheduler): SchedulerLike {
	return new LeaveSchedulerBase(ngZone, scheduler);
}
