import {
  InlayHintKind,
  InlayHintsProvider,
  Position,
  Range,
  TextDocument,
} from "vscode";

import Logger from "../logger";

const pattern = /^(\s{2}UDA priority:\s*)(L|M|H)/;

const abbreviatedLabels = ["Low", "Medium", "High"];

function fromRange({ start, end }: Range): string {
  return `${fromPosition(start)}..${fromPosition(end)}`;
}

function fromPosition({ line, character }: Position): string {
  return `(Ln ${line}, Col ${character})`;
}

function* generateInlayHints(
  document: TextDocument,
  range: Range,
  log: Logger
) {
  if (range.isEmpty) {
    return;
  }

  for (let i = range.start.line; i <= range.end.line; i++) {
    const textLine = document.lineAt(i);
    const matchingGroups = pattern.exec(textLine.text);
    if (!matchingGroups || matchingGroups.length != 3) {
      continue;
    }

    const position = new Position(i, matchingGroups[0].length);
    if (!range.contains(position)) {
      continue;
    }

    const attributeValue = matchingGroups[2];
    const label = abbreviatedLabels.find((text) => text[0] === attributeValue);
    if (!label) {
      continue;
    }

    yield {
      position,
      label: `: ${label}`,
      kind: InlayHintKind.Parameter,
      paddingLeft: true,
    };
  }
}

export function getInlayHintsProvider(log: Logger): InlayHintsProvider {
  return {
    provideInlayHints: (document, range) =>
      Array.from(generateInlayHints(document, range, log)),
    resolveInlayHint: (item) => item,
  };
}
