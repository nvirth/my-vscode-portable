"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const os = require("os");
const path = require("path");
const vscode = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
const Settings = require("../settings");
exports.InvokeExtensionCommandRequestType = new vscode_languageclient_1.RequestType("powerShell/invokeExtensionCommand");
exports.ExtensionCommandAddedNotificationType = new vscode_languageclient_1.NotificationType("powerShell/extensionCommandAdded");
// ---------- Editor Operations ----------
function asRange(value) {
    if (value === undefined) {
        return undefined;
    }
    else if (value === null) {
        return null;
    }
    return { start: asPosition(value.start), end: asPosition(value.end) };
}
function asPosition(value) {
    if (value === undefined) {
        return undefined;
    }
    else if (value === null) {
        return null;
    }
    return { line: value.line, character: value.character };
}
function asCodeRange(value) {
    if (value === undefined) {
        return undefined;
    }
    else if (value === null) {
        return null;
    }
    return new vscode.Range(asCodePosition(value.start), asCodePosition(value.end));
}
function asCodePosition(value) {
    if (value === undefined) {
        return undefined;
    }
    else if (value === null) {
        return null;
    }
    return new vscode.Position(value.line, value.character);
}
exports.GetEditorContextRequestType = new vscode_languageclient_1.RequestType("editor/getEditorContext");
var EditorOperationResponse;
(function (EditorOperationResponse) {
    EditorOperationResponse[EditorOperationResponse["Unsupported"] = 0] = "Unsupported";
    EditorOperationResponse[EditorOperationResponse["Completed"] = 1] = "Completed";
})(EditorOperationResponse || (EditorOperationResponse = {}));
exports.InsertTextRequestType = new vscode_languageclient_1.RequestType("editor/insertText");
exports.SetSelectionRequestType = new vscode_languageclient_1.RequestType("editor/setSelection");
exports.OpenFileRequestType = new vscode_languageclient_1.RequestType("editor/openFile");
exports.NewFileRequestType = new vscode_languageclient_1.RequestType("editor/newFile");
exports.CloseFileRequestType = new vscode_languageclient_1.RequestType("editor/closeFile");
exports.SaveFileRequestType = new vscode_languageclient_1.RequestType("editor/saveFile");
exports.ShowErrorMessageRequestType = new vscode_languageclient_1.RequestType("editor/showErrorMessage");
exports.ShowWarningMessageRequestType = new vscode_languageclient_1.RequestType("editor/showWarningMessage");
exports.ShowInformationMessageRequestType = new vscode_languageclient_1.RequestType("editor/showInformationMessage");
exports.SetStatusBarMessageRequestType = new vscode_languageclient_1.RequestType("editor/setStatusBarMessage");
exports.ClearTerminalNotificationType = new vscode_languageclient_1.NotificationType0("editor/clearTerminal");
class ExtensionCommandsFeature {
    constructor(log) {
        this.log = log;
        this.extensionCommands = [];
        this.command = vscode.commands.registerCommand("PowerShell.ShowAdditionalCommands", () => {
            if (this.languageClient === undefined) {
                this.log.writeAndShowError(`<${ExtensionCommandsFeature.name}>: ` +
                    "Unable to instantiate; language client undefined.");
                return;
            }
            const editor = vscode.window.activeTextEditor;
            let start = editor.selection.start;
            const end = editor.selection.end;
            if (editor.selection.isEmpty) {
                start = new vscode.Position(start.line, 0);
            }
            this.showExtensionCommands(this.languageClient);
        });
        this.command2 = vscode.commands.registerCommand("PowerShell.InvokeRegisteredEditorCommand", (param) => {
            if (this.extensionCommands.length === 0) {
                return;
            }
            const commandToExecute = this.extensionCommands.find((x) => x.name === param.commandName);
            if (commandToExecute) {
                this.languageClient.sendRequest(exports.InvokeExtensionCommandRequestType, { name: commandToExecute.name,
                    context: this.getEditorContext() });
            }
        });
    }
    setLanguageClient(languageclient) {
        // Clear the current list of extension commands since they were
        // only relevant to the previous session
        this.extensionCommands = [];
        this.languageClient = languageclient;
        if (this.languageClient !== undefined) {
            this.languageClient.onNotification(exports.ExtensionCommandAddedNotificationType, (command) => this.addExtensionCommand(command));
            this.languageClient.onRequest(exports.GetEditorContextRequestType, (details) => this.getEditorContext());
            this.languageClient.onRequest(exports.InsertTextRequestType, (details) => this.insertText(details));
            this.languageClient.onRequest(exports.SetSelectionRequestType, (details) => this.setSelection(details));
            this.languageClient.onRequest(exports.NewFileRequestType, (filePath) => this.newFile());
            this.languageClient.onRequest(exports.OpenFileRequestType, (filePath) => this.openFile(filePath));
            this.languageClient.onRequest(exports.CloseFileRequestType, (filePath) => this.closeFile(filePath));
            this.languageClient.onRequest(exports.SaveFileRequestType, (saveFileDetails) => this.saveFile(saveFileDetails));
            this.languageClient.onRequest(exports.ShowInformationMessageRequestType, (message) => this.showInformationMessage(message));
            this.languageClient.onRequest(exports.ShowErrorMessageRequestType, (message) => this.showErrorMessage(message));
            this.languageClient.onRequest(exports.ShowWarningMessageRequestType, (message) => this.showWarningMessage(message));
            this.languageClient.onRequest(exports.SetStatusBarMessageRequestType, (messageDetails) => this.setStatusBarMessage(messageDetails));
            this.languageClient.onNotification(exports.ClearTerminalNotificationType, () => {
                // We check to see if they have TrueClear on. If not, no-op because the
                // overriden Clear-Host already calls [System.Console]::Clear()
                if (Settings.load().integratedConsole.forceClearScrollbackBuffer) {
                    vscode.commands.executeCommand("workbench.action.terminal.clear");
                }
            });
        }
    }
    dispose() {
        this.command.dispose();
        this.command2.dispose();
    }
    addExtensionCommand(command) {
        this.extensionCommands.push({
            name: command.name,
            displayName: command.displayName,
        });
        this.extensionCommands.sort((a, b) => a.name.localeCompare(b.name));
    }
    showExtensionCommands(client) {
        // If no extension commands are available, show a message
        if (this.extensionCommands.length === 0) {
            vscode.window.showInformationMessage("No extension commands have been loaded into the current session.");
            return;
        }
        const quickPickItems = this.extensionCommands.map((command) => {
            return {
                label: command.displayName,
                description: command.name,
                command,
            };
        });
        vscode.window
            .showQuickPick(quickPickItems, { placeHolder: "Select a command" })
            .then((command) => this.onCommandSelected(command, client));
    }
    onCommandSelected(chosenItem, client) {
        if (chosenItem !== undefined) {
            client.sendRequest(exports.InvokeExtensionCommandRequestType, { name: chosenItem.command.name,
                context: this.getEditorContext() });
        }
    }
    insertText(details) {
        const edit = new vscode.WorkspaceEdit();
        edit.set(vscode.Uri.parse(details.filePath), [
            new vscode.TextEdit(new vscode.Range(details.insertRange.start.line, details.insertRange.start.character, details.insertRange.end.line, details.insertRange.end.character), details.insertText),
        ]);
        vscode.workspace.applyEdit(edit);
        return EditorOperationResponse.Completed;
    }
    getEditorContext() {
        return {
            currentFileContent: vscode.window.activeTextEditor.document.getText(),
            currentFileLanguage: vscode.window.activeTextEditor.document.languageId,
            currentFilePath: vscode.window.activeTextEditor.document.uri.toString(),
            cursorPosition: asPosition(vscode.window.activeTextEditor.selection.active),
            selectionRange: asRange(new vscode.Range(vscode.window.activeTextEditor.selection.start, vscode.window.activeTextEditor.selection.end)),
        };
    }
    newFile() {
        return vscode.workspace.openTextDocument({ content: "" })
            .then((doc) => vscode.window.showTextDocument(doc))
            .then((_) => EditorOperationResponse.Completed);
    }
    openFile(openFileDetails) {
        const filePath = this.normalizeFilePath(openFileDetails.filePath);
        const promise = vscode.workspace.openTextDocument(filePath)
            .then((doc) => vscode.window.showTextDocument(doc, { preview: openFileDetails.preview }))
            .then((_) => EditorOperationResponse.Completed);
        return promise;
    }
    closeFile(filePath) {
        let promise;
        if (this.findTextDocument(this.normalizeFilePath(filePath))) {
            promise =
                vscode.workspace.openTextDocument(filePath)
                    .then((doc) => vscode.window.showTextDocument(doc))
                    .then((editor) => vscode.commands.executeCommand("workbench.action.closeActiveEditor"))
                    .then((_) => EditorOperationResponse.Completed);
        }
        else {
            promise = Promise.resolve(EditorOperationResponse.Completed);
        }
        return promise;
    }
    /**
     * Save a file, possibly to a new path. If the save is not possible, return a completed response
     * @param saveFileDetails the object detailing the path of the file to save and optionally its new path to save to
     */
    saveFile(saveFileDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            // Try to interpret the filepath as a URI, defaulting to "file://" if we don't succeed
            let currentFileUri;
            if (saveFileDetails.filePath.startsWith("untitled") || saveFileDetails.filePath.startsWith("file")) {
                currentFileUri = vscode.Uri.parse(saveFileDetails.filePath);
            }
            else {
                currentFileUri = vscode.Uri.file(saveFileDetails.filePath);
            }
            let newFileAbsolutePath;
            switch (currentFileUri.scheme) {
                case "file":
                    // If the file to save can't be found, just complete the request
                    if (!this.findTextDocument(this.normalizeFilePath(currentFileUri.fsPath))) {
                        this.log.writeAndShowError(`File to save not found: ${currentFileUri.fsPath}.`);
                        return EditorOperationResponse.Completed;
                    }
                    // If no newFile is given, just save the current file
                    if (!saveFileDetails.newPath) {
                        const doc = yield vscode.workspace.openTextDocument(currentFileUri.fsPath);
                        if (doc.isDirty) {
                            yield doc.save();
                        }
                        return EditorOperationResponse.Completed;
                    }
                    // Make sure we have an absolute path
                    if (path.isAbsolute(saveFileDetails.newPath)) {
                        newFileAbsolutePath = saveFileDetails.newPath;
                    }
                    else {
                        // If not, interpret the path as relative to the current file
                        newFileAbsolutePath = path.join(path.dirname(currentFileUri.fsPath), saveFileDetails.newPath);
                    }
                    break;
                case "untitled":
                    // We need a new name to save an untitled file
                    if (!saveFileDetails.newPath) {
                        // TODO: Create a class handle vscode warnings and errors so we can warn easily
                        //       without logging
                        this.log.writeAndShowWarning("Cannot save untitled file. Try SaveAs(\"path/to/file.ps1\") instead.");
                        return EditorOperationResponse.Completed;
                    }
                    // Make sure we have an absolute path
                    if (path.isAbsolute(saveFileDetails.newPath)) {
                        newFileAbsolutePath = saveFileDetails.newPath;
                    }
                    else {
                        // In fresh contexts, workspaceFolders is not defined...
                        if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
                            this.log.writeAndShowWarning("Cannot save file to relative path: no workspaces are open. " +
                                "Try saving to an absolute path, or open a workspace.");
                            return EditorOperationResponse.Completed;
                        }
                        // If not, interpret the path as relative to the workspace root
                        const workspaceRootUri = vscode.workspace.workspaceFolders[0].uri;
                        // We don't support saving to a non-file URI-schemed workspace
                        if (workspaceRootUri.scheme !== "file") {
                            this.log.writeAndShowWarning("Cannot save untitled file to a relative path in an untitled workspace. " +
                                "Try saving to an absolute path or opening a workspace folder.");
                            return EditorOperationResponse.Completed;
                        }
                        newFileAbsolutePath = path.join(workspaceRootUri.fsPath, saveFileDetails.newPath);
                    }
                    break;
                default:
                    // Other URI schemes are not supported
                    const msg = JSON.stringify(saveFileDetails);
                    this.log.writeVerbose(`<${ExtensionCommandsFeature.name}>: Saving a document with scheme '${currentFileUri.scheme}' ` +
                        `is currently unsupported. Message: '${msg}'`);
                    return EditorOperationResponse.Completed;
            }
            yield this.saveDocumentContentToAbsolutePath(currentFileUri, newFileAbsolutePath);
            return EditorOperationResponse.Completed;
        });
    }
    /**
     * Take a document available to vscode at the given URI and save it to the given absolute path
     * @param documentUri the URI of the vscode document to save
     * @param destinationAbsolutePath the absolute path to save the document contents to
     */
    saveDocumentContentToAbsolutePath(documentUri, destinationAbsolutePath) {
        return __awaiter(this, void 0, void 0, function* () {
            // Retrieve the text out of the current document
            const oldDocument = yield vscode.workspace.openTextDocument(documentUri);
            // Write it to the new document path
            try {
                // TODO: Change this to be asyncronous
                yield new Promise((resolve, reject) => {
                    fs.writeFile(destinationAbsolutePath, oldDocument.getText(), (err) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve();
                    });
                });
            }
            catch (e) {
                this.log.writeAndShowWarning(`<${ExtensionCommandsFeature.name}>: ` +
                    `Unable to save file to path '${destinationAbsolutePath}': ${e}`);
                return;
            }
            // Finally open the new document
            const newFileUri = vscode.Uri.file(destinationAbsolutePath);
            const newFile = yield vscode.workspace.openTextDocument(newFileUri);
            vscode.window.showTextDocument(newFile, { preview: true });
        });
    }
    normalizeFilePath(filePath) {
        const platform = os.platform();
        if (platform === "win32") {
            // Make sure the file path is absolute
            if (!path.win32.isAbsolute(filePath)) {
                filePath = path.win32.resolve(vscode.workspace.rootPath, filePath);
            }
            // Normalize file path case for comparison for Windows
            return filePath.toLowerCase();
        }
        else {
            // Make sure the file path is absolute
            if (!path.isAbsolute(filePath)) {
                filePath = path.resolve(vscode.workspace.rootPath, filePath);
            }
            // macOS is case-insensitive
            if (platform === "darwin") {
                filePath = filePath.toLowerCase();
            }
            return filePath;
        }
    }
    findTextDocument(filePath) {
        // since Windows and macOS are case-insensitive, we need to normalize them differently
        const canFind = vscode.workspace.textDocuments.find((doc) => {
            let docPath;
            const platform = os.platform();
            if (platform === "win32" || platform === "darwin") {
                // for Windows and macOS paths, they are normalized to be lowercase
                docPath = doc.fileName.toLowerCase();
            }
            else {
                docPath = doc.fileName;
            }
            return docPath === filePath;
        });
        return canFind != null;
    }
    setSelection(details) {
        vscode.window.activeTextEditor.selections = [
            new vscode.Selection(asCodePosition(details.selectionRange.start), asCodePosition(details.selectionRange.end)),
        ];
        return EditorOperationResponse.Completed;
    }
    showInformationMessage(message) {
        return vscode.window
            .showInformationMessage(message)
            .then((_) => EditorOperationResponse.Completed);
    }
    showErrorMessage(message) {
        return vscode.window
            .showErrorMessage(message)
            .then((_) => EditorOperationResponse.Completed);
    }
    showWarningMessage(message) {
        return vscode.window
            .showWarningMessage(message)
            .then((_) => EditorOperationResponse.Completed);
    }
    setStatusBarMessage(messageDetails) {
        if (messageDetails.timeout) {
            vscode.window.setStatusBarMessage(messageDetails.message, messageDetails.timeout);
        }
        else {
            vscode.window.setStatusBarMessage(messageDetails.message);
        }
        return EditorOperationResponse.Completed;
    }
}
exports.ExtensionCommandsFeature = ExtensionCommandsFeature;
//# sourceMappingURL=ExtensionCommands.js.map