import { NgZone } from '@angular/core';
import { SchedulerLike, Subscription } from 'rxjs';

export abstract class BaseNgZoneScheduler implements SchedulerLike {
	constructor(protected ngZone: NgZone, protected scheduler: SchedulerLike) { }

	abstract schedule(...args: any): Subscription;

	public now(): number {
		return this.scheduler.now();
	}
}
