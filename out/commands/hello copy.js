"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const constants = require("../constants");
const hello = () => {
    return vscode.commands.registerCommand(`${constants.project}.${constants.commands.hello}`, () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage("Hello World :) from React On The Fly!");
    });
};
exports.default = hello;
//# sourceMappingURL=hello%20copy.js.map