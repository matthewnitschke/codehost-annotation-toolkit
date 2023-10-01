# Code Host Annotation Toolkit

A toolkit to add inline annotations to common code hosts like Github, Gitlab, and Bitbucket

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
