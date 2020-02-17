'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const config_1 = require("./config");
const quickPicker_1 = require("./quickPicker");
const types_1 = require("./utils/types");
const clipboardy = require('clipboardy');
const pathModule = require('path');
class CurrentFile {
    constructor() {
        this._startsFromRootDirectoryPath = "";
        this._startsFromWorkSpaceHighestDirectoryPath = "";
        this._name = "";
        this._config = new config_1.Config();
        this._quickPicker = new quickPicker_1.QuickPicker();
        this._currentPathStartsFrom = this.config.defaultPathStartsFrom;
        this._currentStyle = this.config.defaultPathStyle;
        this._statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left, this.config.priorityInStatusBar);
        this._statusBarItem.tooltip = "Open Menus";
        this._statusBarItem.command = 'currentFilePath.executeQuickPickerAction';
        this.update();
    }
    get config() {
        return this._config;
    }
    get quickPicker() {
        return this._quickPicker;
    }
    get statusBarItem() {
        return this._statusBarItem;
    }
    get isWorkSpace() {
        return vscode_1.workspace.workspaceFolders !== undefined;
    }
    get currentStyle() {
        if (this._currentStyle === types_1.PathStyles.UNIX) {
            return types_1.PathStyles.UNIX;
        }
        return types_1.PathStyles.WINDOWS;
    }
    set currentStyle(style) {
        this._currentStyle = style;
    }
    get currentPathStartsFrom() {
        if (this._currentPathStartsFrom === types_1.PathStartsFrom.ROOT_DIRECTORY) {
            return types_1.PathStartsFrom.ROOT_DIRECTORY;
        }
        return types_1.PathStartsFrom.WORK_SPACE;
    }
    set currentPathStartsFrom(statingFrom) {
        this._currentPathStartsFrom = statingFrom;
    }
    get startsFromRootDirectoryPath() {
        if (this.currentStyle === types_1.PathStyles.UNIX) {
            return this.toUnixStyle(this._startsFromRootDirectoryPath);
        }
        return this.toWindowsStyle(this._startsFromRootDirectoryPath);
    }
    set startsFromRootDirectoryPath(path) {
        this._startsFromRootDirectoryPath = path;
    }
    get startsFromWorkSpaceHighestDirectoryPath() {
        if (this.currentStyle === types_1.PathStyles.UNIX) {
            return this.toUnixStyle(this._startsFromWorkSpaceHighestDirectoryPath);
        }
        return this.toWindowsStyle(this._startsFromWorkSpaceHighestDirectoryPath);
    }
    set startsFromWorkSpaceHighestDirectoryPath(path) {
        let folders = vscode_1.workspace.workspaceFolders;
        if (folders === undefined) {
            this._startsFromWorkSpaceHighestDirectoryPath = path;
            return;
        }
        let rootFolderObj = folders.find(x => {
            return this.toUnixStyle(path).startsWith(this.toUnixStyle(x.uri.fsPath));
        });
        if (rootFolderObj === undefined) {
            this._startsFromWorkSpaceHighestDirectoryPath = path;
            return;
        }
        this._startsFromWorkSpaceHighestDirectoryPath = pathModule.join(rootFolderObj.name, this.toUnixStyle(path).replace(this.toUnixStyle(rootFolderObj.uri.fsPath), ""));
    }
    get name() {
        return this._name;
    }
    set name(s) {
        this._name = s;
    }
    toUnixStyle(path) {
        return path.replace(/\\/g, "/");
    }
    toWindowsStyle(path) {
        return path.replace(/\//g, "\\");
    }
    updateStatusBar() {
        if (this.currentPathStartsFrom === types_1.PathStartsFrom.ROOT_DIRECTORY) {
            this.statusBarItem.text = this.startsFromRootDirectoryPath;
        }
        else {
            this.statusBarItem.text = this.startsFromWorkSpaceHighestDirectoryPath;
        }
    }
    update() {
        let editor = vscode_1.window.activeTextEditor;
        if (!editor) {
            this.statusBarItem.hide();
            return;
        }
        this.startsFromRootDirectoryPath = editor.document.uri.fsPath;
        this.startsFromWorkSpaceHighestDirectoryPath = editor.document.uri.fsPath;
        this.name = pathModule.basename(editor.document.uri.fsPath);
        this.updateStatusBar();
        this.statusBarItem.show();
    }
    viewUnixStyle() {
        this.currentStyle = types_1.PathStyles.UNIX;
        this.updateStatusBar();
    }
    viewWindowsStyle() {
        this.currentStyle = types_1.PathStyles.WINDOWS;
        this.updateStatusBar();
    }
    viewFromSystemRoot() {
        this.currentPathStartsFrom = types_1.PathStartsFrom.ROOT_DIRECTORY;
        this.updateStatusBar();
    }
    viewFromWorkSpaceRoot() {
        this.currentPathStartsFrom = types_1.PathStartsFrom.WORK_SPACE;
        this.updateStatusBar();
    }
    copy() {
        if (this.currentPathStartsFrom === types_1.PathStartsFrom.ROOT_DIRECTORY) {
            clipboardy.writeSync(this.startsFromRootDirectoryPath);
            return;
        }
        clipboardy.writeSync(this.startsFromWorkSpaceHighestDirectoryPath);
    }
    copyFileName() {
        clipboardy.writeSync(this.name);
    }
    copyFileNameWithOutExtension() {
        clipboardy.writeSync(this.name.slice(0, this.name.lastIndexOf(".")));
    }
    executeQuickPickerAction() {
        this.quickPicker.getActionId(this.currentStyle, this.isWorkSpace, this.currentPathStartsFrom).then((actionId) => {
            switch (actionId) {
                case quickPicker_1.QuickPickerAction.viewUnixStyle:
                    this.viewUnixStyle();
                    return;
                case quickPicker_1.QuickPickerAction.viewWindowsStyle:
                    this.viewWindowsStyle();
                    return;
                case quickPicker_1.QuickPickerAction.viewFromSystemRoot:
                    this.viewFromSystemRoot();
                    return;
                case quickPicker_1.QuickPickerAction.viewFromWorkSpaceRoot:
                    this.viewFromWorkSpaceRoot();
                    return;
                case quickPicker_1.QuickPickerAction.copy:
                    this.copy();
                    return;
                case quickPicker_1.QuickPickerAction.copyFileName:
                    this.copyFileName();
                    return;
                case quickPicker_1.QuickPickerAction.copyFileNameWithOutExtension:
                    this.copyFileNameWithOutExtension();
                    return;
                default:
                    return;
            }
        });
    }
    dispose() {
        this.statusBarItem.dispose();
    }
}
exports.CurrentFile = CurrentFile;
//# sourceMappingURL=currentFile.js.map