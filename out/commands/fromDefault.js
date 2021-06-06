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
exports.fromDefaultWithImport = exports.fromDefault = void 0;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const constants = require("../constants");
const handlebars_1 = require("handlebars");
const utils_1 = require("../utils");
function doWriteTemplate(stream, name) {
    const raw = fs.readFileSync(path.resolve(__dirname, "../templates/component.json"), "utf8");
    const template = JSON.parse(raw);
    const engine = handlebars_1.default.compile(template.source);
    const binded = engine({ name });
    stream.write(binded);
    stream.close();
}
function create(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const dir = yield utils_1.getSelectedDirectory(context);
        if (!dir) {
            return;
        }
        const name = yield utils_1.getDesiredName(dir.fsPath);
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
            vscode.window.showInformationMessage(`react-on-the-fly: ${name} component created in ${dir.fsPath}`);
            return name;
        }
    });
}
function fromDefault() {
    return vscode.commands.registerCommand(`${constants.project}.${constants.commands.fromDefault}`, (context) => __awaiter(this, void 0, void 0, function* () {
        yield create(context);
    }));
}
exports.fromDefault = fromDefault;
function fromDefaultWithImport() {
    return vscode.commands.registerCommand(`${constants.project}.${constants.commands.fromDefaultWithImport}`, () => __awaiter(this, void 0, void 0, function* () {
        const context = utils_1.getActiveFileDirectory();
        const name = yield create(context);
        if (name) {
            yield utils_1.doPasteImport(name);
        }
    }));
}
exports.fromDefaultWithImport = fromDefaultWithImport;
//# sourceMappingURL=fromDefault.js.map