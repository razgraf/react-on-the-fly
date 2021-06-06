"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveFileDirectory = exports.doCreateDirectory = exports.getNormalizedDirectory = exports.isFilePathInWorkspace = void 0;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
function isFilePathInWorkspace(file) {
    const workspace = vscode.workspace.workspaceFolders[0].uri.fsPath;
    return file.startsWith(workspace);
}
exports.isFilePathInWorkspace = isFilePathInWorkspace;
function getNormalizedDirectory(source) {
    const exists = fs.existsSync(source);
    if (exists) {
        const stat = fs.statSync(source);
        if (stat.isDirectory()) {
            return vscode.Uri.parse(source);
        }
        else if (stat.isFile()) {
            const directory = path.dirname(source);
            return vscode.Uri.parse(directory);
        }
    }
    return undefined;
}
exports.getNormalizedDirectory = getNormalizedDirectory;
function doCreateDirectory(base, name) {
    const location = path.join(base.fsPath, name);
    /** Step 1: check if the base is indeed available and a directory */
    if (!fs.existsSync(base.fsPath)) {
        return undefined;
    }
    else {
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
exports.doCreateDirectory = doCreateDirectory;
function getActiveFileDirectory() {
    if (vscode.window.activeTextEditor) {
        const file = vscode.window.activeTextEditor.document.uri;
        const directory = path.dirname(file.fsPath);
        return vscode.Uri.parse(directory);
    }
    return undefined;
}
exports.getActiveFileDirectory = getActiveFileDirectory;
//# sourceMappingURL=index.js.map