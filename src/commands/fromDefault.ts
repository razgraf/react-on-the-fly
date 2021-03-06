import * as vscode from "vscode";
import * as fs from "fs";
import * as constants from "../constants";
import handlebars from "handlebars";

import defaultTemplate from "../templates/component.json";

import {
  doCreateDirectory,
  doCreateFile,
  getSelectedDirectory,
  getDesiredName,
  doPasteImport,
  getActiveFileDirectory,
} from "../utils";

function doWriteTemplate(stream: fs.WriteStream, name: string): void {
  const template = defaultTemplate;

  const engine = handlebars.compile(template.source);
  const binded = engine({ name });

  stream.write(binded);
  stream.close();
}

async function create(
  context: vscode.Uri | undefined
): Promise<string | undefined> {
  const dir = await getSelectedDirectory(context);
  if (!dir) {
    return;
  }
  const name = await getDesiredName(dir.fsPath);
  if (dir && name) {
    const componentDirectory = doCreateDirectory(dir, name);
    if (!componentDirectory) {
      vscode.window.showErrorMessage(
        `Error encountered when creating the "${name}" directory. Check if a directory with the same name is not already there. [react-on-the-fly]`
      );
      return;
    }

    const componentFileStream = doCreateFile(componentDirectory, "index.js");
    if (!componentFileStream) {
      vscode.window.showErrorMessage(
        `Error encountered when creating the "${name}" file. Check if the component directory is not already created. [react-on-the-fly]`
      );
      return;
    }

    doWriteTemplate(componentFileStream, name);

    vscode.window.showInformationMessage(
      `react-on-the-fly: ${name} component created in ${dir.fsPath}`
    );

    return name;
  }
}

export function fromDefault(): vscode.Disposable {
  return vscode.commands.registerCommand(
    `${constants.project}.${constants.commands.fromDefault}`,
    async (context) => {
      await create(context);
    }
  );
}

export function fromDefaultWithImport(): vscode.Disposable {
  return vscode.commands.registerCommand(
    `${constants.project}.${constants.commands.fromDefaultWithImport}`,
    async () => {
      const context = getActiveFileDirectory();
      const name = await create(context);
      if (name) {
        await doPasteImport(name);
      }
    }
  );
}
