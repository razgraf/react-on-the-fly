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
const shared_1 = require("./shared");
function doWriteTemplate(stream, name) {
    if (!vscode.workspace ||
        !vscode.workspace.workspaceFolders ||
        !vscode.workspace.workspaceFolders.length) {
        vscode.window.showErrorMessage(`Please open a workspace/project first. [react-on-the-fly]`);
        return;
    }
    const workspace = vscode.workspace.workspaceFolders[0].uri;
    const existsH1 = fs.existsSync(path.join(workspace.fsPath, `${constants.configuration.path}.handlebars`));
    const existsH2 = fs.existsSync(path.join(workspace.fsPath, `${constants.configuration.path}.hbs`));
    const existsDirectory = fs.existsSync(path.join(workspace.fsPath, `${constants.configuration.directory}`));
    let source = null;
    if (!existsH1 && !existsH2) {
        let configurationDirectory = null;
        if (!existsDirectory) {
            configurationDirectory = utils_1.doCreateDirectory(workspace, constants.configuration.directory);
            if (!configurationDirectory) {
                vscode.window.showErrorMessage(`Error encountered when creating the configuration directory. Please submit a github issue if the problem persists. [react-on-the-fly]`);
                return;
            }
        }
        else {
            configurationDirectory = vscode.Uri.parse(path.join(workspace.fsPath, `${constants.configuration.directory}`));
        }
        const configurationFileStream = utils_1.doCreateFile(configurationDirectory, `${constants.configuration.file}.handlebars`);
        if (!configurationFileStream) {
            vscode.window.showErrorMessage(`Error encountered when creating the configuration file. Please submit a github issue if the problem persists. [react-on-the-fly]`);
            return;
        }
        const configurationRaw = fs.readFileSync(path.resolve(__dirname, "../templates/component.json"), "utf8");
        const configurationTemplate = JSON.parse(configurationRaw);
        configurationFileStream.write(configurationTemplate.source);
        configurationFileStream.close();
        source = configurationTemplate.source;
    }
    else {
        const raw = fs.readFileSync(path.resolve(workspace.fsPath, `${constants.configuration.path}.handlebars`), "utf8");
        source = raw;
    }
    const engine = handlebars_1.default.compile(source);
    const binded = engine({ name });
    stream.write(binded);
    stream.close();
}
function fromTemplate() {
    return vscode.commands.registerCommand(`${constants.project}.${constants.commands.fromTemplate}`, () => __awaiter(this, void 0, void 0, function* () {
        const dir = yield shared_1.getSelectedDirectory();
        if (!dir) {
            return;
        }
        const name = yield shared_1.getDesiredName(dir.fsPath);
        if (dir && name) {
            const componentDirectory = utils_1.doCreateDirectory(dir, name);
            if (!componentDirectory) {
                vscode.window.showErrorMessage(`Error encountered when creating the "${name}" directory. Check if a directory with the same name is not already there. [react-on-the-fly]`);
                return;
            }
            const componentFileStream = utils_1.doCreateFile(componentDirectory, "index.js");
            if (!componentFileStream) {
                vscode.window.showErrorMessage(`Error encountered when creating the "${name}" file. Check if the component directory is not already created. [react-on-the-fly]`);
                return;
            }
            doWriteTemplate(componentFileStream, name);
            vscode.window.showInformationMessage(`react-on-the-fly: ${name} component created in ${dir === null || dir === void 0 ? void 0 : dir.fsPath}`);
        }
    }));
}
exports.default = fromTemplate;
//# sourceMappingURL=fromTemplate.js.map