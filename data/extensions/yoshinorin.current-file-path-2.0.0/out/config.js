'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class Config {
    constructor() {
        this._defaultPathStyle = "";
        this._priorityInStatusBar = 0;
        this._defaultPathStartsFrom = "";
        try {
            this._config = vscode_1.workspace.getConfiguration("currentFilePath");
            this._defaultPathStyle = this._config.defaultPathStyle;
            this._priorityInStatusBar = this._config.priorityInStatusBar;
            this._defaultPathStartsFrom = this._config.defaultPathStartsFrom;
        }
        catch (ex) {
            vscode_1.window.showErrorMessage(ex.message);
        }
    }
    get defaultPathStyle() {
        return this._defaultPathStyle;
    }
    get priorityInStatusBar() {
        return this._priorityInStatusBar;
    }
    get defaultPathStartsFrom() {
        return this._defaultPathStartsFrom;
    }
}
exports.Config = Config;
//# sourceMappingURL=config.js.map