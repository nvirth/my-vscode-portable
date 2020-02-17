'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class EditorChangeListner {
    _onEvent() {
        this._currentFile.update();
    }
    constructor(currentFile) {
        this._currentFile = currentFile;
        let subscriptions = [];
        vscode_1.window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);
        this._disposable = vscode_1.Disposable.from(...subscriptions);
    }
    dispose() {
        this._disposable.dispose();
    }
}
exports.EditorChangeListner = EditorChangeListner;
//# sourceMappingURL=editorChangeListner.js.map