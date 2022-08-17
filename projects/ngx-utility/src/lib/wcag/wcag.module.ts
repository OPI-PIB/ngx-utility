import {
	APP_INITIALIZER, Injector, ModuleWithProviders, NgModule,
} from '@angular/core';

import { Wcag } from './wcag.service';

// https://github.com/ng-packagr/ng-packagr/issues/696
// tslint:disable:prefer-immediate-return
export function getFactory(injector: Injector): () => void {
	const result = () => {
		const wcag = injector.get(Wcag);
		wcag.init();
	};

	return result;
}

@NgModule()
export class WcagModule {
	static forRoot(): ModuleWithProviders<WcagModule> {
		return {
			ngModule: WcagModule,
			providers: [
				Wcag,
				{
					provide: APP_INITIALIZER,
					useFactory: getFactory,
					multi: true,
					deps: [Injector],
				},
			],
		};
	}
}
