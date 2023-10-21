import { OnStyleLineCallback, OnStyleSpanCallback, Location } from "./models";

import { annotateFile as annotateGithubFileView } from "./github/file";
import { annotatePr as annotateGithubPrFilesView } from "./github/pr";

const isGithubFileView = () => window.location.href.match(/https:\/\/github\.com\/.*\/.*\/blob/);
const isGithubPrFilesView = () => window.location.href.match(/https:\/\/github\.com\/.*\/.*\/pull\/[0-9]+\/files/);

export function annotateFile(options: {
    fileName?: string,
    annotations: Location[],
    onStyleLine?: OnStyleLineCallback,
    onStyleSpan?: OnStyleSpanCallback,
}) {
    if (isGithubFileView()) {
        annotateGithubFileView(options.annotations, options.onStyleLine, options.onStyleSpan);
    } else if (isGithubPrFilesView()) {
        if (options.fileName == null) throw Error('File name is required on github pr view annotations');

        annotateGithubPrFilesView({ [options.fileName]: options.annotations }, options.onStyleLine, options.onStyleSpan);
    } else {
        throw Error(`Unknown href: ${window.location.href}`);
    }
}

export function annotateFiles(options: {
    files: {[fileName: string]: Location[]},
    onStyleLine?: OnStyleLineCallback,
    onStyleSpan?: OnStyleSpanCallback,
}) {
    if (isGithubFileView()) {
        if (Object.keys(options.files).length > 1) throw Error('Multiple files provided on github singular file view');
        annotateGithubFileView(Object.values(options.files)[0], options.onStyleLine, options.onStyleSpan);
    } else if (isGithubPrFilesView()) {
        annotateGithubPrFilesView(options.files, options.onStyleLine, options.onStyleSpan);
    } else {
        throw Error(`Unknown href: ${window.location.href}`);
    }
}

export async function waitForReady() {
    return new Promise<void>((acc, rej) => {
        setInterval(() => {
            if (isGithubFileView() && document.querySelector('.react-code-text') != null) {
                acc();
            } else if (isGithubPrFilesView() && document.querySelector('.js-file-line') != null) {
                acc();
            }
        }, 100)
    })
}