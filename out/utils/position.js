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
const vscode = __importStar(require("vscode"));
class ImportPosition {
    constructor(editor, importText) {
        this.editor = editor;
        this.importText = importText;
    }
    importToBottom() {
        const indicators = [
            // Script
            "import  from ",
            "import { ",
            "import {  as  } from ",
            "import {  as name } from ",
            "import * as  from ",
            "import * as name from ",
            "import * as ",
            "import '",
            'import "',
            'from "',
            "from '",
            "var  = require(",
            "const  = require(",
            "var name = require(",
            "const name = require(",
            "var  = import(",
            "const  = import(",
            "var name = import(",
            "const name = import(",
            // Stylesheet
            "@import '",
            '@import "',
            "@import url(",
            "@import () ",
            "@use '",
            '@use "',
        ];
        let documentText = this.editor.document.getText();
        documentText = documentText.split("\n");
        let lastLine = 0;
        documentText.forEach((context, line) => {
            const count = indicators.some((e) => context.includes(e));
            count ? (lastLine = ++line) : 0;
        });
        this.editor.edit((active) => {
            const position = new vscode.Position(lastLine, 0);
            active.insert(position, this.importText);
        });
    }
    pasteImport() {
        this.importToBottom();
    }
}
exports.default = ImportPosition;
//# sourceMappingURL=position.js.map