export type OnStyleNodeCallback = (
    node: HTMLElement,
    line: HTMLElement,
    meta: {line: number, start: number, end: number},
) => void;