import { TestBed } from '@angular/core/testing';

import { MarkupRenderer } from './markup-renderer.service';

describe('MarkupRenderer', () => {
	let service: MarkupRenderer;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(MarkupRenderer);
	});

	it('should sanitize markup', () => {
		const markup = `<script>alert("0wned")</script>123`;
		const parent = document.createElement('div');
		const maxChunkLength = 2;

		service.renderMarkup({ markup, parent, maxChunkLength });

		expect(parent.innerHTML).toBe(`<span>12</span><span>3</span>`);
	});

	it('should split text nodes every 2 chars', () => {
		const markup = `<script>alert("0wned")</script><div class="aaa">123<div class="bbb">123</div></div>123`;
		const parent = document.createElement('div');
		const maxChunkLength = 2;

		service.renderMarkup({ markup, parent, maxChunkLength });

		expect(parent.innerHTML).toBe(
			// eslint-disable-next-line max-len
			`<div class="aaa"><span>12</span><span>3</span><div class="bbb"><span>12</span><span>3</span></div></div><span>12</span><span>3</span>`,
		);
	});

	it('should split text nodes every 4 chars', () => {
		const markup = `<span>1234567</span>1234567<span>1234567</span>1234567`;
		const parent = document.createElement('div');
		const maxChunkLength = 4;

		service.renderMarkup({ markup, parent, maxChunkLength });

		expect(parent.innerHTML).toBe(
			// eslint-disable-next-line max-len
			`<span><span>1234</span><span>567</span></span><span>1234</span><span>567</span><span><span>1234</span><span>567</span></span><span>1234</span><span>567</span>`,
		);
	});

	it('should split text nodes every 7 chars', () => {
		const markup = `<span>1234567</span>1234567<span>1234567</span>1234567`;
		const parent = document.createElement('div');
		const maxChunkLength = 7;

		service.renderMarkup({ markup, parent, maxChunkLength });

		expect(parent.innerHTML).toBe(`<span>1234567</span>1234567<span>1234567</span>1234567`);
	});
});
