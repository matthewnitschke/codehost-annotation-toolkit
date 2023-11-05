import { OnStyleLineCallback, OnStyleSpanCallback, Location } from "../models";

export function annotateFile(
    annotations: Location[],
    onStyleLine?: OnStyleLineCallback,
    onStyleSpan?: OnStyleSpanCallback,
) {
    annotations.forEach((location) => {
        let line = typeof location === 'number' ? location : location[0];

        let lineEl = document.querySelector<HTMLElement>(`.react-code-text[data-key="${line - 1}"]`);
        if (lineEl == null) return;

        if (onStyleLine != null) onStyleLine(lineEl, {line});

        // No need to run span logic if onStyleSpan wasn't provided
        if (onStyleSpan == null) return;

        // onStyleSpan might be populated, but [location] only contains a single line reference
        // in this case we're just styling the line, so skip the span logic
        if (!Array.isArray(line)) return;

        let spans = lineEl.querySelectorAll<HTMLSpanElement>('.react-file-line span');

        let [_, start, end] = line;

        let pos = 0;
        spans.forEach((span) => {
            let codeText = span.dataset.codeText ?? '';

            let spanStart = pos;
            let spanEnd = pos + codeText.length;

            if (start <= spanStart && end >= spanEnd) {
                onStyleSpan(span, {line, start, end});
            } else if (start >= spanStart && start < spanEnd) {
                let offset = start - spanStart;
                let length = Math.min(end, spanEnd) - start;

                let contentEl = span.cloneNode() as HTMLSpanElement;
                let suffixEl = span.cloneNode() as HTMLSpanElement;

                span.dataset.codeText = codeText.substring(0, offset);
                contentEl.dataset.codeText = codeText.substring(offset, offset + length);
                onStyleSpan(contentEl, {line, start, end});
                suffixEl.dataset.codeText = codeText.substring(offset + length);

                span.after(contentEl, suffixEl);
            } else if (spanStart < end && end <= spanEnd) {
                let length = end - spanStart;

                let suffixEl = span.cloneNode() as HTMLSpanElement;

                span.dataset.codeText = codeText.substring(0, length);
                onStyleSpan(span, {line, start, end});
                suffixEl.dataset.codeText = codeText.substring(length);
                span.after(suffixEl);
            }

            pos += codeText.length;
        })
    });
}