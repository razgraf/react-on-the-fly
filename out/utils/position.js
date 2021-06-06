"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
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