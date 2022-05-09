import { CodeLens, CodeLensProvider, Range, TextDocument } from "vscode";

const pattern = /^(\s{2}Dependencies:\s*)(.*)/;

async function provideCodeLenses(
  document: TextDocument,
  descriptionsByIdProvider: DescriptionsByIdProvider
) {
  const codeLenses: CodeLens[] = [];

  for (let i = 0; i < document.lineCount; i++) {
    const textLine = document.lineAt(i);
    const matchingGroups = pattern.exec(textLine.text);
    if (!matchingGroups || matchingGroups.length != 3) {
      continue;
    }

    const range = new Range(
      i,
      matchingGroups[1].length,
      i,
      matchingGroups[0].length
    );
    const taskFilter = matchingGroups[2];
    if (!taskFilter) {
      continue;
    }

    for (const [id, description] of await descriptionsByIdProvider.map(
      taskFilter
    )) {
      codeLenses.push(
        new CodeLens(range, {
          title: `${id}: ${description}`,
          // This is an informational code lens, which has no actionable command
          command: "",
        })
      );
    }
  }

  return codeLenses;
}

export interface DescriptionsByIdProvider {
  map(taskFilter: string): Promise<Map<string, string>>;
}

export function getDependenciesCodeLensProvider(
  descriptionsByIdProvider: DescriptionsByIdProvider
): CodeLensProvider {
  return {
    provideCodeLenses: (document) =>
      provideCodeLenses(document, descriptionsByIdProvider),
    resolveCodeLens: (item) => item,
  };
}
