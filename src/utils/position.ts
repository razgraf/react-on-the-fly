import * as vscode from "vscode";

export default class ImportPosition {
  private editor: vscode.TextEditor;
  private importText: string;

  constructor(editor: vscode.TextEditor, importText: string) {
    this.editor = editor;
    this.importText = importText;
  }

  private importToBottom() {
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

    let documentText: any = this.editor.document.getText();
    documentText = documentText.split("\n");

    let lastLine = 0;
    (<string[]>documentText).forEach((context, line) => {
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
