import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

export function isFilePathInWorkspace(file: string) {
  const workspace = vscode.workspace.workspaceFolders[0].uri.fsPath;
  return file.startsWith(workspace);
}

export function getNormalizedDirectory(source: string): vscode.Uri | undefined {
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

export function doCreateDirectory(
  base: vscode.Uri,
  name: string
): vscode.Uri | undefined {
  const location = path.join(base.fsPath, name);
  /** Step 1: check if the base is indeed available and a directory */
  if (!fs.existsSync(base.fsPath)) {
    return undefined;
  } else {
    const stat = fs.statSync(base.fsPath);
    if (!stat.isDirectory()) {
      return undefined;
    }
  }
  /** Step 1: check if the new directory is not already created */
  if (fs.existsSync(location)) {
    return undefined;
  }

  fs.mkdirSync(location);
  vscode.Uri.parse(location);
}

export function getActiveFileDirectory(): vscode.Uri | undefined {
  if (vscode.window.activeTextEditor) {
    const file = vscode.window.activeTextEditor.document.uri;
    const directory = path.dirname(file.fsPath);
    return vscode.Uri.parse(directory);
  }

  return undefined;
}
