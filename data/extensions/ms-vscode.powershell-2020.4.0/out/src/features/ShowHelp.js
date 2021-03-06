"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
exports.ShowHelpNotificationType = new vscode_languageclient_1.NotificationType("powerShell/showHelp");
class ShowHelpFeature {
    constructor(log) {
        this.log = log;
        this.command = vscode.commands.registerCommand("PowerShell.ShowHelp", (item) => {
            if (this.languageClient === undefined) {
                this.log.writeAndShowError(`<${ShowHelpFeature.name}>: ` +
                    "Unable to instantiate; language client undefined.");
                return;
            }
            if (!item || !item.Name) {
                const editor = vscode.window.activeTextEditor;
                const selection = editor.selection;
                const doc = editor.document;
                const cwr = doc.getWordRangeAtPosition(selection.active);
                const text = doc.getText(cwr);
                this.languageClient.sendNotification(exports.ShowHelpNotificationType, { text });
            }
            else {
                this.languageClient.sendNotification(exports.ShowHelpNotificationType, { text: item.Name });
            }
        });
    }
    dispose() {
        this.command.dispose();
        this.deprecatedCommand.dispose();
    }
    setLanguageClient(languageclient) {
        this.languageClient = languageclient;
    }
}
exports.ShowHelpFeature = ShowHelpFeature;
//# sourceMappingURL=ShowHelp.js.map