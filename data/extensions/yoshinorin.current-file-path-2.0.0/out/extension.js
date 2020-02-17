'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const currentFile_1 = require("./currentFile");
const editorChangeListner_1 = require("./editorChangeListner");
function activate(context) {
    let currentFile = new currentFile_1.CurrentFile();
    let listner = new editorChangeListner_1.EditorChangeListner(currentFile);
    let disposableCommands = [
        vscode_1.commands.registerCommand('currentFilePath.executeQuickPickerAction', () => { currentFile.executeQuickPickerAction(); }),
        vscode_1.commands.registerCommand('currentFilePath.viewUnixStyle', () => { currentFile.viewUnixStyle(); }),
        vscode_1.commands.registerCommand('currentFilePath.viewWindowsStyle', () => { currentFile.viewWindowsStyle(); }),
        vscode_1.commands.registerCommand('currentFilePath.viewFromSystemRoot', () => { currentFile.viewFromSystemRoot(); }),
        vscode_1.commands.registerCommand('currentFilePath.viewFromWorkSpaceRoot', () => { currentFile.viewFromWorkSpaceRoot(); }),
        vscode_1.commands.registerCommand('currentFilePath.copy', () => { currentFile.copy(); }),
        vscode_1.commands.registerCommand('currentFilePath.copyFileName', () => { currentFile.copyFileName(); }),
        vscode_1.commands.registerCommand('currentFilePath.copyFileNameWithOutExtension', () => { currentFile.copyFileNameWithOutExtension(); }),
    ];
    disposableCommands.forEach((command) => {
        context.subscriptions.push(command);
    });
    context.subscriptions.push(listner);
    context.subscriptions.push(currentFile);
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map