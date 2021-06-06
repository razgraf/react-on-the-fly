"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveFileDirectory = exports.doCreateFile = exports.doCreateDirectory = exports.getNormalizedDirectory = exports.isFilePathInWorkspace = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
function isFilePathInWorkspace(file) {
    if (!vscode.workspace ||
        !vscode.workspace.workspaceFolders ||
        !vscode.workspace.workspaceFolders.length) {
        return false;
    }
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
    if (base === undefined || name === undefined || name.length === 0) {
        return undefined;
    }
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
    return vscode.Uri.parse(location);
}
exports.doCreateDirectory = doCreateDirectory;
function doCreateFile(base, name) {
    if (base === undefined) {
        return undefined;
    }
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
    /** Step 1: check if the new file is not already created */
    if (fs.existsSync(location)) {
        return undefined;
    }
    return fs.createWriteStream(location);
}
exports.doCreateFile = doCreateFile;
function getActiveFileDirectory() {
    if (vscode.window.activeTextEditor) {
        const file = vscode.window.activeTextEditor.document.uri;
        const directory = path.dirname(file.fsPath);
        return vscode.Uri.parse(directory);
    }
    return undefined;
}
exports.getActiveFileDirectory = getActiveFileDirectory;
//# sourceMappingURL=system.js.map