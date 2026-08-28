declare module 'page-flip/dist/js/page-flip.module.js' {
  export class PageFlip {
    constructor(el: HTMLElement, settings: object);
    destroy(): void;
    flipNext(): void;
    flipPrev(): void;
    getPageCount(): number;
    loadFromImages(images: string[]): void;
    on(event: string, cb: (e: { data: number }) => void): void;
  }
}
