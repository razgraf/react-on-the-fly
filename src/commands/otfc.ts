import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as constants from "../constants";

async function getNormalizedDirectory(
  source: string
): Promise<vscode.Uri | undefined> {
  const exists = fs.existsSync(source);
  if (exists) {
    const stat = fs.statSync(source);
    if (stat.isDirectory()) {
      return vscode.Uri.parse(source);
    } else if (stat.isFile()) {
      const directory = path.dirname(source);
      return vscode.Uri.parse(directory);
    }
  }
  return undefined;
}

async function getActiveFileDirectory(): Promise<vscode.Uri | undefined> {
  if (vscode.window.activeTextEditor) {
    const file = vscode.window.activeTextEditor.document.uri;
    const directory = path.dirname(file.fsPath);
    return vscode.Uri.parse(directory);
  }

  return undefined;
}

async function getSelectedDirectory(): Promise<vscode.Uri | undefined> {
  /** Step 1: try to get the selected folder from the file menu tree
   *  Workaround as per https://github.com/Microsoft/vscode/issues/3553#issuecomment-757560862
   */
  await vscode.commands.executeCommand("copyFilePath");
  let directory = await vscode.env.clipboard.readText();
  try {
    if (directory.includes("\n")) {
      directory = directory.split("\n")[0];
    }
    return getNormalizedDirectory(directory);
  } catch (e) {
    console.error(e);
  }

  /**
   * Step 2: If step 1 doesn't yield any usable directory, use the base workspace directory
   * Implementation as per: https://github1s.com/fayras/vscode-simple-new-file/
   */

  if (directory === undefined) {
    /** Step 2.1: Get the *single* selected workspace */
    if (vscode.workspace.workspaceFolders?.length === 1) {
      return vscode.workspace.workspaceFolders[0].uri;
    } else {
      /** Step 2.2: If there are more workspaces, manually select a folder */
      const workspacePicker = await vscode.window.showWorkspaceFolderPick();
      if (workspacePicker) {
        return workspacePicker.uri;
      }
    }
  }

  return undefined;
}

function otfc(): vscode.Disposable {
  return vscode.commands.registerCommand(
    `${constants.project}.${constants.commands.otfc}`,
    async () => {
      const dir = await getSelectedDirectory();
      vscode.window.showInformationMessage(`CWD: ${dir?.fsPath}`);
    }
  );
}

export default otfc;
