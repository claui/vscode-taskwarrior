# vscode-taskwarrior

This is the source code repository for the `taskwarrior` VS Code extension.

## What it does

This VS Code extension provides syntax highlighting for Taskwarrior’s `task edit` command.

<!-- Uncomment as soon as it has more features -->
<!--
For more details, see [extension/README.md](./extension/README.md).
-->

## Building the extension

Building this VS Code extension requires `yarn` to be installed on your system.

To install dependencies, run: `yarn install`

To build the extension, run: `yarn package`

Unlike `vsce package`, running `yarn package` will work around issue microsoft/vscode-vsce#517.
Use `yarn package` as long as the issue is unresolved.

## Publishing the extension

To publish to the VS Code Extension Marketplace, first choose a target version.  
[The VS Code folks recommend](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#prerelease-extensions) the following numbering scheme:

- `major.ODD_NUMBER.patch` (e.g. 1.1.0) for **pre-release** versions; and
- `major.EVEN_NUMBER.patch` (e.g. 1.2.0) for **release** versions.

After deciding on a target version, run:

- `yarn login`
- `yarn publish [version]`

The `yarn publish` command first updates the version number in [extension/package.json](./extension/package.json) to the given version. Then it packages and publishes the extension to the VS Code Extension Marketplace.

## License

This source code repository contains code and assets sourced from different parties. Therefore, multiple sets of license terms apply to different parts of this source code repository.

The following table shows which terms apply to which parts of this source code repository:

| Directory tree | Description | License | Terms |
|---|---|---|---|
| `.` | This directory | Apache-2.0 | [License](./LICENSE)<br>with License header below |
| `./.yarn/releases` | The `yarn` package manager | BSD-2-Clause | [License](./.yarn/releases/LICENSE) |
| `./extension` | The source code for this VS Code extension | Apache-2.0 | [License](./extension/LICENSE.txt)<br>with [License header](./extension/README.md#license) |

In each of the directories the table mentions, you will find one license file, named `LICENSE` or `LICENSE.txt`.  
Each license file applies to the directory that contains it, including all subdirectories, but excluding any subdirectory tree whose root has a license file on its own.

## License header

Copyright (c) 2022 Claudia Pellegrino

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
For a copy of the License, see [LICENSE](LICENSE).
