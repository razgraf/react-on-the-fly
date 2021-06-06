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
    const raw = fs.readFileSync(path.resolve(__dirname, "../templates/component.json"), "utf8");
    const template = JSON.parse(raw);
    const engine = handlebars_1.default.compile(template.source);
    const binded = engine({ name });
    stream.write(binded);
    stream.close();
}
function fromDefault() {
    return vscode.commands.registerCommand(`${constants.project}.${constants.commands.fromDefault}`, () => __awaiter(this, void 0, void 0, function* () {
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
exports.default = fromDefault;
//# sourceMappingURL=fromDefault.js.map