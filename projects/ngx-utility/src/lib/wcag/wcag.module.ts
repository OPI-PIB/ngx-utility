import {
	APP_INITIALIZER, Injector, ModuleWithProviders, NgModule,
} from '@angular/core';

import { Wcag } from './wcag.service';

export function getFactory(injector: Injector): () => void {
	return () => {
		const wcag = injector.get(Wcag);
		wcag.init();
	};
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
