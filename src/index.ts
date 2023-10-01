import { OnStyleNodeCallback } from "./models";

import { annotateFile as annotateGithubFileView } from "./github/file";
import { annotatePr as annotateGithubPrFilesView } from "./github/pr";

const isGithubFileView = () => window.location.href.match(/https:\/\/github\.com\/.*\/.*\/blob/);
const isGithubPrFilesView = () => window.location.href.match(/https:\/\/github\.com\/.*\/.*\/pull\/[0-9]+\/files/);

export function annotateFile(options: {
    fileName?: string,
    annotations: number[][],
    onStyleNode: OnStyleNodeCallback,
}) {
    if (isGithubFileView()) {
        annotateGithubFileView(options.annotations, options.onStyleNode);
    } else if (isGithubPrFilesView()) {
        if (options.fileName == null) throw Error('TBD');

        annotateGithubPrFilesView({ [options.fileName]: options.annotations }, options.onStyleNode);
    } else {
        throw Error('TBD');
    }
}

export function annotateFiles(options: {
    files: {[fileName: string]: number[][]},
    onStyleNode: OnStyleNodeCallback,
}) {
    if (isGithubFileView()) {
        if (Object.keys(options.files).length > 1) throw Error('TBD');

        annotateGithubFileView(Object.values(options.files)[0], options.onStyleNode);
    } else if (isGithubPrFilesView()) {
        annotateGithubPrFilesView(options.files, options.onStyleNode);
    } else {
        throw Error('TBD');
    }
}