import { OnStyleNodeCallback } from "../models";

export function annotateFile(
    annotations: number[][],
    onStyleNode: OnStyleNodeCallback,
) {
    annotations.forEach(([line, start, end]) => {
        let lineEl = document.querySelector(`.react-code-text[data-key="${line}"] .react-file-line`);
        if (lineEl == null) return;

        let spans = lineEl.querySelectorAll('span');

        let pos = 0;
        spans.forEach((span) => {
            let codeText = span.dataset.codeText ?? '';

            let spanStart = pos;
            let spanEnd = pos + codeText.length;

            if (start <= spanStart && end >= spanEnd) {
                onStyleNode(span, {line, start, end});
            } else if (start >= spanStart && start < spanEnd) {
                let offset = start - spanStart;
                let length = Math.min(end, spanEnd) - start;

                let contentEl = span.cloneNode() as HTMLSpanElement;
                let suffixEl = span.cloneNode() as HTMLSpanElement;

                span.dataset.codeText = codeText.substring(0, offset);
                contentEl.dataset.codeText = codeText.substring(offset, offset + length);
                onStyleNode(contentEl, {line, start, end});
                suffixEl.dataset.codeText = codeText.substring(offset + length);

                span.after(contentEl, suffixEl);
            } else if (spanStart < end && end <= spanEnd) {
                let length = end - spanStart;

                let suffixEl = span.cloneNode() as HTMLSpanElement;

                span.dataset.codeText = codeText.substring(0, length);
                onStyleNode(span, {line, start, end});
                suffixEl.dataset.codeText = codeText.substring(length);
                span.after(suffixEl);
            }

            pos += codeText.length;
        })
    });
}