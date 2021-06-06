"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const constants = require("../constants");
function getNormalizedDirectory(source) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
function getActiveFileDirectory() {
    return __awaiter(this, void 0, void 0, function* () {
        if (vscode.window.activeTextEditor) {
            const file = vscode.window.activeTextEditor.document.uri;
            const directory = path.dirname(file.fsPath);
            return vscode.Uri.parse(directory);
        }
        return undefined;
    });
}
function getSelectedDirectory() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        /** Step 1: try to get the selected folder from the file menu tree
         *  Workaround as per https://github.com/Microsoft/vscode/issues/3553#issuecomment-757560862
         */
        yield vscode.commands.executeCommand("copyFilePath");
        let directory = yield vscode.env.clipboard.readText();
        try {
            if (directory.includes("\n")) {
                directory = directory.split("\n")[0];
            }
            return getNormalizedDirectory(directory);
        }
        catch (e) {
            console.error(e);
        }
        /**
         * Step 2: If step 1 doesn't yield any usable directory, use the base workspace directory
         * Implementation as per: https://github1s.com/fayras/vscode-simple-new-file/
         */
        if (directory === undefined) {
            /** Step 2.1: Get the *single* selected workspace */
            if (((_a = vscode.workspace.workspaceFolders) === null || _a === void 0 ? void 0 : _a.length) === 1) {
                return vscode.workspace.workspaceFolders[0].uri;
            }
            else {
                /** Step 2.2: If there are more workspaces, manually select a folder */
                const workspacePicker = yield vscode.window.showWorkspaceFolderPick();
                if (workspacePicker) {
                    return workspacePicker.uri;
                }
            }
        }
        return undefined;
    });
}
function otfc() {
    return vscode.commands.registerCommand(`${constants.project}.${constants.commands.otfc}`, () => __awaiter(this, void 0, void 0, function* () {
        const dir = yield getSelectedDirectory();
        vscode.window.showInformationMessage(`CWD: ${dir === null || dir === void 0 ? void 0 : dir.fsPath}`);
    }));
}
exports.default = otfc;
//# sourceMappingURL=otfc.js.map