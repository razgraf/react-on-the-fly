import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as constants from "../constants";
import handlebars from "handlebars";

import { doCreateDirectory, doCreateFile } from "../utils";
import { getSelectedDirectory, getDesiredName } from "./shared";

function doWriteTemplate(stream: fs.WriteStream, name: string): void {
  const raw = fs.readFileSync(
    path.resolve(__dirname, "../templates/component.json"),
    "utf8"
  );

  const template = JSON.parse(raw);
  const engine = handlebars.compile(template.source);
  const binded = engine({ name });

  stream.write(binded);
  stream.close();
}

function fromDefault(): vscode.Disposable {
  return vscode.commands.registerCommand(
    `${constants.project}.${constants.commands.fromDefault}`,
    async () => {
      const dir = await getSelectedDirectory();
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

        const componentFileStream = doCreateFile(
          componentDirectory,
          "index.js"
        );
        if (!componentFileStream) {
          vscode.window.showErrorMessage(
            `Error encountered when creating the "${name}" file. Check if the component directory is not already created. [react-on-the-fly]`
          );
          return;
        }
        doWriteTemplate(componentFileStream, name);

        vscode.window.showInformationMessage(
          `react-on-the-fly: ${name} component created in ${dir?.fsPath}`
        );
      }
    }
  );
}

export default fromDefault;
