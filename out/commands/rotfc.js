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
const handlebars_1 = require("handlebars");
const utils_1 = require("../utils");
function getSelectedDirectory() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
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
        if (exists && utils_1.isFilePathInWorkspace(directory)) {
            return utils_1.getNormalizedDirectory(directory);
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
function doWriteTemplate(stream, name) {
    const raw = fs.readFileSync(path.resolve(__dirname, "../templates/component.json"), "utf8");
    const template = JSON.parse(raw);
    const engine = handlebars_1.default.compile(template.source);
    const binded = engine({ name });
    stream.write(binded);
    stream.close();
}
function otfc() {
    return vscode.commands.registerCommand(`${constants.project}.${constants.commands.otfc}`, () => __awaiter(this, void 0, void 0, function* () {
        const dir = yield getSelectedDirectory();
        if (!dir) {
            return;
        }
        const name = yield getDesiredName(dir.fsPath);
        if (dir && name) {
            const componentDirectory = utils_1.doCreateDirectory(dir, name);
            if (!componentDirectory) {
                vscode.window.showErrorMessage(`Error encountered when creating the "${name}" directory. Check if a directory with the same name is not already there. [react-on-the-fly]`);
                return;
            }
            const componentFileStream = utils_1.doCreateIndexFile(componentDirectory);
            if (!componentFileStream) {
                vscode.window.showErrorMessage(`Error encountered when creating the "${name}" file. Check if the component directory is not already created. [react-on-the-fly]`);
                return;
            }
            doWriteTemplate(componentFileStream, name);
            vscode.window.showInformationMessage(`react-on-the-fly: ${name} component created in ${dir === null || dir === void 0 ? void 0 : dir.fsPath}`);
        }
    }));
}
exports.default = otfc;
//# sourceMappingURL=rotfc.js.map