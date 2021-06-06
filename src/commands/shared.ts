import * as vscode from "vscode";
import * as fs from "fs";

import { isFilePathInWorkspace, getNormalizedDirectory } from "../utils";

export async function getSelectedDirectory(): Promise<vscode.Uri | undefined> {
  /**
   * Step 1: try to get the selected folder from the file menu tree
   * Workaround as per https://github.com/Microsoft/vscode/issues/3553#issuecomment-757560862
   */
  await vscode.commands.executeCommand("copyFilePath");
  let directory = await vscode.env.clipboard.readText();

  if (directory.includes("\n")) {
    directory = directory.split("\n")[0];
  }
  const exists = fs.existsSync(directory);
  if (exists && isFilePathInWorkspace(directory)) {
    return getNormalizedDirectory(directory);
  }

  directory = undefined;

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

export async function getDesiredName(
  directory: string
): Promise<string | undefined> {
  const inputBox = await vscode.window.showInputBox({
    title: "What is the name of your new component?",
    placeHolder: "Component",
    prompt: `Create component in ${directory}`,
  });
  if (inputBox === undefined || inputBox.length === 0) {
    vscode.window.showErrorMessage(
      "react-on-the-fly: You need to pick a name for your new <Component/>"
    );
    return undefined;
  }

  return (inputBox.charAt(0).toUpperCase() + inputBox.slice(1)).replace(
    " ",
    ""
  );
}
