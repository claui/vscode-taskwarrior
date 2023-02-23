import {
  InlayHintKind,
  InlayHintsProvider,
  Position,
  Range,
  TextDocument,
} from "vscode";

const pattern = /^(?:\s{2}UDA priority:\s*)(?<value>L|M|H)/;

const abbreviatedLabels: string[] = ["Low", "Medium", "High"];

function *generateInlayHints(document: TextDocument, range: Range) {
  if (range.isEmpty) {
    return;
  }

  for (let i: number = range.start.line; i <= range.end.line; i++) {
    const matchResult: RegExpExecArray | null =
      pattern.exec(document.lineAt(i).text);
    if (!matchResult) {
      continue;
    }

    const position = new Position(i, matchResult[0].length);
    const label : string | undefined = abbreviatedLabels
      .find((text) => text[0] === matchResult.groups?.value);

    if (range.contains(position) && label) {
      yield {
        position,
        label: `: ${label}`,
        kind: InlayHintKind.Parameter,
        paddingLeft: true,
      };
    }
  }
}

export function getInlayHintsProvider(): InlayHintsProvider {
  return {
    provideInlayHints: (document, range) =>
      Array.from(generateInlayHints(document, range)),
    resolveInlayHint: (item) => item,
  };
}
