import * as vscode from "vscode";
import * as constants from "../constants";

function hello(): vscode.Disposable {
  return vscode.commands.registerCommand(
    `${constants.project}.${constants.commands.hello}`,
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage(
        "Hello World :) from React On The Fly!"
      );
    }
  );
}

export default hello;
