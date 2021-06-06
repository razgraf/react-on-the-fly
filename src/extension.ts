import * as vscode from "vscode";
import hello from "./commands/hello";
import otfc from "./commands/otfc";

export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json

  context.subscriptions.push(hello());
  context.subscriptions.push(otfc());
}

export function deactivate() {}
