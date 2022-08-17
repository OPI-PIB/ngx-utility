import {
	FocusMonitor, HighContrastMode, HighContrastModeDetector, LiveAnnouncer,
} from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { isDefined } from '@opi-pib/ts-utility';

export const HC_ACTIVE_CSS_CLASS = 'hc-active';

@Injectable({
	providedIn: 'root',
})
export class Wcag {
	private initialized: boolean;

	private documentRef: Document;

	constructor(
		@Inject(DOCUMENT) private document: any,
		private highContrastModeDetector: HighContrastModeDetector,
		private liveAnnouncer: LiveAnnouncer,
		private focusMonitor: FocusMonitor,
	) {
		this.initialized = false;
		this.documentRef = this.document; // https://github.com/angular/angular/issues/20351
	}

	/**
	 * Add message in aria live region
	 */
	async announce(message: string): Promise<void> {
		await this.liveAnnouncer.announce(message);
	}

	init(): void {
		if (this.initialized === false) {
			this.initialized = true;
			this.trackLastFocus();
			this.detectHighContrastMode();
		}
	}

	private trackLastFocus(): void {
		this.focusMonitor.monitor(this.documentRef.body, true).subscribe();
	}

	private detectHighContrastMode(): void {
		this.documentRef.body.classList.remove(HC_ACTIVE_CSS_CLASS);

		if (!this.detectHighContrastModeInChrome()) {
			const highContrastMode: HighContrastMode = this.highContrastModeDetector.getHighContrastMode();

			if (highContrastMode === HighContrastMode.BLACK_ON_WHITE || highContrastMode === HighContrastMode.WHITE_ON_BLACK) {
				this.documentRef.body.classList.add(HC_ACTIVE_CSS_CLASS);
			}
		}
	}

	private detectHighContrastModeInChrome(): boolean {
		// chrome with high-contrast extension only
		const htmlTag: HTMLElement = this.documentRef.getElementsByTagName('html')[0];
		const isChromeExtensionHighContrastMode: boolean = isDefined(htmlTag.getAttribute('hc'));

		if (isChromeExtensionHighContrastMode === true) {
			this.documentRef.body.classList.add(HC_ACTIVE_CSS_CLASS);
		}

		return isChromeExtensionHighContrastMode;
	}
}
