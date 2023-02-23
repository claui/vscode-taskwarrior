import { CodeLens, CodeLensProvider, Range, TextDocument } from "vscode";

const pattern = /^(?<keySection>\s{2}Dependencies:\s*)(?<value>.*)/;

// matchResult?.groups is guaranteed non-null in this method
/* eslint-disable @typescript-eslint/no-non-null-assertion */
function provideCodeLenses(
  document: TextDocument,
  descriptionsByIdProvider: DescriptionsByIdProvider,
) {
  const codeLenses: CodeLens[] = [];

  for (let i: number = 0; i < document.lineCount; i++) {
    const matchResult: RegExpExecArray | null =
      pattern.exec(document.lineAt(i).text);
    if (!matchResult) {
      continue;
    }

    const range = new Range(
      i,
      matchResult.groups!.keySection.length,
      i,
      matchResult[0].length,
    );
    const descriptionsById: Map<string, string> =
      descriptionsByIdProvider.map(matchResult.groups!.value);

    for (const [id, description] of descriptionsById) {
      codeLenses.push(
        new CodeLens(range, {
          title: `${id}: ${description}`,
          // This is an informational code lens, which has no actionable command
          command: "",
        }));
    }
  }

  return codeLenses;
}

export interface DescriptionsByIdProvider {
  map(taskFilter: string): Map<string, string>;
}

export function getDependenciesCodeLensProvider(
  descriptionsByIdProvider: DescriptionsByIdProvider,
): CodeLensProvider {
  return {
    provideCodeLenses: (document) =>
      provideCodeLenses(document, descriptionsByIdProvider),
    resolveCodeLens: (item) => item,
  };
}
