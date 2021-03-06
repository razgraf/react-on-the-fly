import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as constants from "../constants";
import handlebars from "handlebars";

import {
  doCreateDirectory,
  doCreateFile,
  getSelectedDirectory,
  getDesiredName,
  doPasteImport,
  getActiveFileDirectory,
} from "../utils";

function doWriteTemplate(stream: fs.WriteStream, name: string): void {
  if (
    !vscode.workspace ||
    !vscode.workspace.workspaceFolders ||
    !vscode.workspace.workspaceFolders.length
  ) {
    vscode.window.showErrorMessage(
      `Please open a workspace/project first. [react-on-the-fly]`
    );
    return;
  }

  const workspace = vscode.workspace.workspaceFolders[0].uri;

  const existsH1 = fs.existsSync(
    path.join(workspace.fsPath, `${constants.configuration.path}.handlebars`)
  );
  const existsH2 = fs.existsSync(
    path.join(workspace.fsPath, `${constants.configuration.path}.hbs`)
  );

  const existsDirectory = fs.existsSync(
    path.join(workspace.fsPath, `${constants.configuration.directory}`)
  );

  let source = null;

  if (!existsH1 && !existsH2) {
    let configurationDirectory = null;
    if (!existsDirectory) {
      configurationDirectory = doCreateDirectory(
        workspace,
        constants.configuration.directory
      );
      if (!configurationDirectory) {
        vscode.window.showErrorMessage(
          `Error encountered when creating the configuration directory. Please submit a github issue if the problem persists. [react-on-the-fly]`
        );
        return;
      }
    } else {
      configurationDirectory = vscode.Uri.file(
        path.join(workspace.fsPath, `${constants.configuration.directory}`)
      );
    }

    const configurationFileStream = doCreateFile(
      configurationDirectory,
      `${constants.configuration.file}.handlebars`
    );
    if (!configurationFileStream) {
      vscode.window.showErrorMessage(
        `Error encountered when creating the configuration file. Please submit a github issue if the problem persists. [react-on-the-fly]`
      );
      return;
    }

    const configurationRaw = fs.readFileSync(
      path.resolve(__dirname, "../templates/component.json"),
      "utf8"
    );

    const configurationTemplate = JSON.parse(configurationRaw);

    configurationFileStream.write(configurationTemplate.source);
    configurationFileStream.close();

    source = configurationTemplate.source;
  } else {
    const raw = fs.readFileSync(
      path.resolve(
        workspace.fsPath,
        `${constants.configuration.path}.handlebars`
      ),
      "utf8"
    );

    source = raw;
  }

  const engine = handlebars.compile(source);
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
      `react-on-the-fly: ${name} component created in ${dir?.fsPath}`
    );

    return name;
  }
}

export function fromTemplate(): vscode.Disposable {
  return vscode.commands.registerCommand(
    `${constants.project}.${constants.commands.fromTemplate}`,
    async (context) => {
      await create(context);
    }
  );
}

export function fromTemplateWithImport(): vscode.Disposable {
  return vscode.commands.registerCommand(
    `${constants.project}.${constants.commands.fromTemplateWithImport}`,
    async () => {
      const context = getActiveFileDirectory();
      const name = await create(context);
      if (name) {
        await doPasteImport(name);
      }
    }
  );
}
