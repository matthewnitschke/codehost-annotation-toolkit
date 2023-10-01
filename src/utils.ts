export function wrapTextNodes(node: HTMLElement) {
    if (node.nodeType === Node.TEXT_NODE && node.parentNode!.childNodes.length > 1) {
        const span = document.createElement('span');
        span.textContent = node.textContent;
        node.parentNode!.replaceChild(span, node);
    }

    for (let i = 0; i < node.childNodes.length; i++) {
      wrapTextNodes(node.childNodes[i] as HTMLElement);
    }
}