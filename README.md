# Code Host Annotation Toolkit

> [!IMPORTANT]
> This project is very much still in alpha, feel free to use/experiment with, but please don't use in a production use-case, its API will change without warning, and everything is largely untested

A toolkit to add inline annotations to common code hosts like Github, Gitlab, and Bitbucket

## Usage

Add the following to your `package.json`
```
{
  "dependencies": {
    "codehost-annotation-toolkit": "git://github.com/matthewnitschke/codehost-annotation-toolkit",
  }
}
```

```js
import { annotateFile, annotateFiles } from 'codehost-annotation-toolkit';

// annotates a single file
annotateFile({
  // The ranges within the file that should be annotated
  annotations: [
    // in the format of: [line, start, end]
    [1, 4, 5],

    // or just the line to annotate (only runs [onStyleLine])
    8,
  ],

  // styles the 4-5 span
  onStyleSpan: (el, {line, start, end}) => el.style.textDecoration = 'line-through',

  // styles line 1, and 8
  onStyleLine: (el, {line}) => el.style.backgroundColor = 'yellow',

  // optional, only necessary if multiple files can be displayed on the page at once
  fileName: 'path/to/your/file.ext'
});

annotateFiles({
  // The ranges within the file that should be annotated
  annotations: {
    'path/to/your/file.ext': [
      [1, 4, 5]
    ]
  },
  onStyleSpan: (el, {line, start, end}) => el.style.textDecoration = 'line-through'
});
```

## Compatibility

`codehost-annotation-tookit` is still very much in progress. Compatibility is limited based on what I need at the time. PRs/Issues are welcome for additional code host support

### Git Hosts

| Name      | PRs                | Files              |
| --------- | ------------------ | ------------------ |
| Github    | :white_check_mark: | :white_check_mark: |
| Gitlab    | :x:                | :x:                |
| Bitbucket | :x:                | :x:                |

### Code Search

| Name               | Search | Files                                               | Note |
| ------------------ | ------ | --------------------------------------------------- | ---- |
| Sourcegraph        | :x:    | :x:                                                 | Soucegraph's codemirror implementation deletes any dom modifications after change. At the time being injecting annotations will not be possible for this code host |
| GitHub Code Search | :x:    | :white_check_mark: (same as [Git Host](#git-hosts)) | |
