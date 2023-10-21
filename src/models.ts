export type OnStyleSpanCallback = (
    spanEl: HTMLElement,
    meta: {line: number, start: number, end: number},
) => void;

export type OnStyleLineCallback = (
    lineEl: HTMLElement,
    meta: {line: number},
) => void;

export type Location = number[] | number