import { OnStyleLineCallback, OnStyleSpanCallback, Location } from "../models";
import { wrapTextNodes } from "../utils";

export function annotatePr(
    annotations: {[fileName: string]: Location[]},
    onStyleLine?: OnStyleLineCallback,
    onStyleSpan?: OnStyleSpanCallback,
) {
    let fileNames = Object.keys(annotations);
    for (var i = 0; i < fileNames.length; i ++) {
        let fileName = fileNames[i];

        for (var j = 0; j < annotations[fileName].length; j ++) {
            injectAnnotation(fileName, annotations[fileName][j], onStyleLine, onStyleSpan);
        }
    }
}

function injectAnnotation(
    fileName: string,
    location: Location,
    onStyleLine?: OnStyleLineCallback,
    onStyleSpan?: OnStyleSpanCallback,
) {
    let line = typeof location === 'number' ? location : location[0];

    let lineElBtn = document.querySelector(`.js-file-line button[data-path="${fileName}"][data-line="${line}"]`);
    if (lineElBtn == null) return;

    let codeEl = lineElBtn.parentNode?.querySelector<HTMLElement>('.blob-code-inner');
    if (codeEl == null) return;

    if (onStyleLine != null) onStyleLine(codeEl.parentElement!, {line});

    // No need to run span logic if onStyleSpan wasn't provided
    if (onStyleSpan == null) return;

    // onStyleSpan might be populated, but [location] only contains a single line reference
    // in this case we're just styling the line, so skip the span logic
    if (!Array.isArray(location)) return;

    wrapTextNodes(codeEl);

    let lineContent = codeEl.querySelectorAll<HTMLSpanElement>('span:not(:has(*))');

    let [_, start, end] = location;

    let pos = 0;
    lineContent.forEach((lineEl) => {
        let spanStart = pos;
        let spanEnd = pos + lineEl.innerText.length;

        if (start <= spanStart && end >= spanEnd) {
            onStyleSpan(lineEl, {line, start, end});
        } else if (start >= spanStart && start < spanEnd) {
            let offset = start - spanStart;
            let length = Math.min(end, spanEnd) - start;

            let prefix = lineEl.innerText.substring(0, offset);
            let content = lineEl.innerText.substring(offset, offset+length);
            let suffix = lineEl.innerText.substring(offset+length);

            lineEl.innerText = prefix;
            let annotatedSpan = document.createElement('span');
            annotatedSpan.innerText = content;
            onStyleSpan(annotatedSpan, {line, start, end});

            lineEl.appendChild(annotatedSpan);
            lineEl.appendChild(document.createTextNode(suffix));
        } else if (spanStart < end && end <= spanEnd) {
            let length = end - spanStart;

            let content = lineEl.innerText.substring(0, length);
            let suffix = lineEl.innerText.substring(length);

            lineEl.innerText = '';
            let annotatedSpan = document.createElement('span');
            annotatedSpan.innerText = content;
            onStyleSpan(annotatedSpan, {line, start, end});

            lineEl.appendChild(annotatedSpan);
            lineEl.appendChild(document.createTextNode(suffix));
        }

        pos += lineEl.innerText.length;
    });
}