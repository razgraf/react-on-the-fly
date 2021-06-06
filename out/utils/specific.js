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
exports.doPasteImport = exports.getDesiredName = exports.getSelectedDirectory = void 0;
const vscode = require("vscode");
const fs = require("fs");
const position_1 = require("./position");
const system_1 = require("./system");
function getSelectedDirectory(context) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        /**
         * Step 0: If the directory comes from the context menu as an argument, use that
         */
        if (context && context.fsPath) {
            return context;
        }
        /**
         * Step 1: try to get the selected folder from the file menu tree
         * Workaround as per https://github.com/Microsoft/vscode/issues/3553#issuecomment-757560862
         */
        yield vscode.commands.executeCommand("copyFilePath");
        let directory = yield vscode.env.clipboard.readText();
        if (directory.includes("\n")) {
            directory = directory.split("\n")[0];
        }
        const exists = fs.existsSync(directory);
        if (exists && system_1.isFilePathInWorkspace(directory)) {
            return system_1.getNormalizedDirectory(directory);
        }
        directory = undefined;
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
exports.getSelectedDirectory = getSelectedDirectory;
function getDesiredName(directory) {
    return __awaiter(this, void 0, void 0, function* () {
        const inputBox = yield vscode.window.showInputBox({
            title: "What is the name of your new component?",
            placeHolder: "Component",
            prompt: `Create component in ${directory}`,
        });
        if (inputBox === undefined || inputBox.length === 0) {
            vscode.window.showErrorMessage("react-on-the-fly: You need to pick a name for your new <Component/>");
            return undefined;
        }
        return (inputBox.charAt(0).toUpperCase() + inputBox.slice(1)).replace(" ", "");
    });
}
exports.getDesiredName = getDesiredName;
function doPasteImport(name) {
    return __awaiter(this, void 0, void 0, function* () {
        yield vscode.commands.executeCommand("notifications.clearAll");
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("react-on-the-fly: Missing an active editor. Please open a file and call this command again.");
            return undefined;
        }
        /**
         * Implementation as per: https://github1s.com/ElecTreeFrying/auto-import-relative-path
         */
        const importPosition = new position_1.default(editor, `import ${name} from "./${name}"\n`);
        importPosition.pasteImport();
    });
}
exports.doPasteImport = doPasteImport;
//# sourceMappingURL=specific.js.map