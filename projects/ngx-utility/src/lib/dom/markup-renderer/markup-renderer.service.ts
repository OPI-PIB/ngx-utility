import {
	Injectable, Renderer2, RendererFactory2, SecurityContext,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { isDefined, Maybe } from '@opi-pib/ts-utility';
import { splitEvery } from 'ramda';

export interface RenderMarkupProps {
	markup: string;
	parent: HTMLElement;
	maxChunkLength?: number;
}

type RenderMarkupInitialProps = Required<Omit<RenderMarkupProps, 'markup' | 'parent'>>;

const initialProps: RenderMarkupInitialProps = {
	maxChunkLength: 2000,
};

@Injectable({
	providedIn: 'root',
})
export class MarkupRenderer {
	private renderer: Renderer2;

	constructor(private rendererFactory: RendererFactory2, private domSanitizer: DomSanitizer) {
		this.renderer = this.rendererFactory.createRenderer(null, null);
	}

	/**
	 * Render html markup, if html contains large text nodes they will be splitted to separate spans based on maxChunkLength value
	 */
	renderMarkup(props: RenderMarkupProps, callback: () => any = () => { }): void {
		const propsWithInitials: Required<RenderMarkupProps> = {
			...initialProps,
			...props,
		};

		const markupElement = this.#buildMarkupElement(props.markup);

		if (markupElement != null) {
			const normalizedNodes: HTMLElement[] = this.#getNormalizeNodes(this.#getNodes(markupElement), propsWithInitials.maxChunkLength);
			this.#appendNormalizedNodes(propsWithInitials.parent, normalizedNodes);
		}

		callback();
	}

	#buildMarkupElement(markup: string): Maybe<HTMLElement> {
		const safeMarkup = this.domSanitizer.sanitize(SecurityContext.HTML, markup);
		let element: Maybe<HTMLElement> = null;

		if (typeof safeMarkup === 'string' && safeMarkup.length > 0) {
			element = this.renderer.createElement('div');

			if (isDefined(element)) {
				element.innerHTML = safeMarkup;
			}
		}

		return element;
	}

	#getNormalizeNodes(nodes: HTMLElement[], maxChunkLength: number): HTMLElement[] {
		const normalizedNodes: HTMLElement[] = [];

		nodes.forEach((node) => {
			if (
				node.nodeType === Node.TEXT_NODE &&
				typeof node.textContent?.length === 'number' &&
				node.textContent.length > maxChunkLength
			) {
				const chunks = splitEvery(maxChunkLength, node.textContent);

				if (Array.isArray(chunks)) {
					chunks.forEach((chunkText) => {
						const nodeChunk = this.renderer.createElement('span');
						nodeChunk.innerHTML = chunkText;

						normalizedNodes.push(nodeChunk);
					});
				} else {
					normalizedNodes.push(node);
				}
			} else {
				const normalizedNode = this.#setNormalizedNodes(node, this.#getNormalizeNodes(this.#getNodes(node), maxChunkLength));
				normalizedNodes.push(normalizedNode);
			}
		});

		return normalizedNodes;
	}

	#appendNormalizedNodes(parent: HTMLElement, nodes: HTMLElement[]): HTMLElement {
		nodes.forEach((node) => {
			this.renderer.appendChild(parent, node);
		});

		return parent;
	}

	#setNormalizedNodes(parent: HTMLElement, nodes: HTMLElement[]): HTMLElement {
		parent.innerHTML = '';

		return this.#appendNormalizedNodes(parent, nodes);
	}

	#getNodes(element: HTMLElement): HTMLElement[] {
		return [].slice.call(element.childNodes);
	}
}
