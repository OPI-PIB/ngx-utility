import { FocusMonitor } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { WINDOW } from '../dom/window/window';
import { WcagColorScheme } from './wcag-color-scheme.enum';

@Injectable({
	providedIn: 'root',
})
export class Wcag implements OnDestroy {
	#initialized = false;

	#subscriptions = new Subscription();

	constructor(@Inject(DOCUMENT) private document: Document, @Inject(WINDOW) private window: Window, private focusMonitor: FocusMonitor) {}

	/**
	 * Initialize module
	 */
	init(): void {
		if (this.#initialized === false) {
			this.#initialized = true;
			this.#trackFocus();
		}
	}

	ngOnDestroy(): void {
		this.#subscriptions.unsubscribe();
	}

	/**
	 * Returns prefered color scheme
	 *
	 * @Firefox
	 * In order to force Firefox to take into account the operating system settings,
	 * you should set `ui.systemUsesDarkTheme` with value `2` in `about:config`
	 */
	getPreferedColorScheme(): WcagColorScheme | null {
		const forcedColors = this.window.matchMedia('(forced-colors: active)');
		const isDark = this.window.matchMedia('(prefers-color-scheme: dark)');

		if (forcedColors.matches) {
			if (isDark.matches) {
				return WcagColorScheme.Dark;
			}

			return WcagColorScheme.Light;
		}

		return null;
	}

	/**
	 * It will add .cdk-focused and .cdk-${origin}-focused (with ${origin} being mouse, keyboard, touch, or program) to the body element
	 * if any element is focused.
	 */
	#trackFocus(): void {
		this.#subscriptions.add(this.focusMonitor.monitor(this.document.body, true).subscribe());
	}
}
