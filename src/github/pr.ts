import { OnStyleNodeCallback } from "../models";
import { wrapTextNodes } from "../utils";

export function annotatePr(
    annotations: {[fileName: string]: number[][]},
    onStyleNode: OnStyleNodeCallback,
) {
    let fileNames = Object.keys(annotations);
    for (var i = 0; i < fileNames.length; i ++) {
        let fileName = fileNames[i];

        for (var j = 0; j < annotations[fileName].length; j ++) {
            injectAnnotation(fileName, annotations[fileName][j], onStyleNode);
        }
    }
}

function injectAnnotation(
    fileName: string,
    [line, start, end]: number[],
    onStyleNode: OnStyleNodeCallback,
) {
    let lineElBtn = document.querySelector(`.js-file-line button[data-path="${fileName}"][data-line="${line}"]`);
    if (lineElBtn == null) return;

    let codeEl = lineElBtn.parentNode?.querySelector<HTMLElement>('.blob-code-inner');
    if (codeEl == null) return;

    wrapTextNodes(codeEl);

    let lineContent = codeEl.querySelectorAll<HTMLSpanElement>('span:not(:has(*))');

    let pos = 0;
    lineContent.forEach((lineEl) => {
        let spanStart = pos;
        let spanEnd = pos + lineEl.innerText.length;

        if (start <= spanStart && end >= spanEnd) {
            onStyleNode(lineEl, lineEl, {line, start, end});
        } else if (start >= spanStart && start < spanEnd) {
            let offset = start - spanStart;
            let length = Math.min(end, spanEnd) - start;

            let prefix = lineEl.innerText.substring(0, offset);
            let content = lineEl.innerText.substring(offset, offset+length);
            let suffix = lineEl.innerText.substring(offset+length);

            lineEl.innerText = prefix;
            let annotatedSpan = document.createElement('span');
            annotatedSpan.innerText = content;
            onStyleNode(annotatedSpan, lineEl, {line, start, end});

            lineEl.appendChild(annotatedSpan);
            lineEl.appendChild(document.createTextNode(suffix));
        } else if (spanStart < end && end <= spanEnd) {
            let length = end - spanStart;

            let content = lineEl.innerText.substring(0, length);
            let suffix = lineEl.innerText.substring(length);

            lineEl.innerText = '';
            let annotatedSpan = document.createElement('span');
            annotatedSpan.innerText = content;
            onStyleNode(annotatedSpan, lineEl, {line, start, end});

            lineEl.appendChild(annotatedSpan);
            lineEl.appendChild(document.createTextNode(suffix));
        }

        pos += lineEl.innerText.length;
    });
}