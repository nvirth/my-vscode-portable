"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cp = require("child_process");
const path = require("path");
const readline = require("readline");
const vscode = require("vscode");
const input_1 = require("./input");
const utilities_1 = require("./utilities");
const util_1 = require("util");
let server;
let rl;
let serverRunning = false;
let executingCommand = false;
function activate(context) {
    let standardError = '';
    serverRunning = true;
    server = cp.spawn('dotnet', [context.asAbsolutePath(path.join('server', 'CSharpToTypeScript.Server', 'bin', 'Release', 'netcoreapp2.2', 'publish', 'CSharpToTypeScript.Server.dll'))]);
    server.on('error', err => {
        serverRunning = false;
        vscode.window.showErrorMessage(`"C# to TypeScript" server related error occurred: "${err.message}".`);
    });
    server.stderr.on('data', data => {
        standardError += data;
    });
    server.on('exit', code => {
        serverRunning = false;
        vscode.window.showWarningMessage(`"C# to TypeScript" server shutdown with code: "${code}". Standard error: "${standardError}".`);
    });
    rl = readline.createInterface(server.stdout, server.stdin);
    context.subscriptions.push(vscode.commands.registerCommand('csharpToTypeScript.csharpToTypeScriptReplace', replaceCommand), vscode.commands.registerCommand('csharpToTypeScript.csharpToTypeScriptToClipboard', toClipboardCommand), vscode.commands.registerCommand('csharpToTypeScript.csharpToTypeScriptPasteAs', pasteAsCommand), vscode.commands.registerCommand('csharpToTypeScript.csharpToTypeScriptToFile', toFileCommand));
}
exports.activate = activate;
function deactivate() {
    if (serverRunning && server) {
        server.stdin.write('EXIT\n');
    }
}
exports.deactivate = deactivate;
function replaceCommand() {
    return __awaiter(this, void 0, void 0, function* () {
        const code = utilities_1.textFromActiveDocument();
        yield convert(code, (convertedCode) => __awaiter(this, void 0, void 0, function* () {
            if (!vscode.window.activeTextEditor) {
                return;
            }
            const document = vscode.window.activeTextEditor.document;
            const selection = vscode.window.activeTextEditor.selection;
            yield vscode.window.activeTextEditor.edit(builder => builder.replace(!selection.isEmpty ? selection : utilities_1.fullRange(document), convertedCode));
        }));
    });
}
function toClipboardCommand() {
    return __awaiter(this, void 0, void 0, function* () {
        const code = utilities_1.textFromActiveDocument();
        yield convert(code, (convertedCode) => __awaiter(this, void 0, void 0, function* () {
            yield vscode.env.clipboard.writeText(convertedCode);
        }));
    });
}
function pasteAsCommand() {
    return __awaiter(this, void 0, void 0, function* () {
        const code = yield vscode.env.clipboard.readText();
        yield convert(code, (convertedCode) => __awaiter(this, void 0, void 0, function* () {
            if (!vscode.window.activeTextEditor) {
                return;
            }
            const selection = vscode.window.activeTextEditor.selection;
            yield vscode.window.activeTextEditor.edit(builder => builder.replace(selection, convertedCode));
        }));
    });
}
function toFileCommand(uri) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        uri = (uri !== null && uri !== void 0 ? uri : (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.uri);
        if (!uri) {
            return;
        }
        const document = yield vscode.workspace.openTextDocument(uri);
        const code = document.getText();
        const filePath = uri.path;
        yield convert(code, (convertedCode, convertedFileName) => __awaiter(this, void 0, void 0, function* () {
            if (!convertedFileName) {
                return;
            }
            yield vscode.workspace.fs.writeFile(vscode.Uri.file(path.join(path.dirname(filePath), convertedFileName)), new util_1.TextEncoder().encode(convertedCode));
        }), filePath);
    });
}
function convert(code, onConverted, fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!serverRunning) {
            vscode.window.showErrorMessage(`"C# to TypeScript" server isn't running! Reload Window to restart it.`);
            return;
        }
        if (!vscode.window.activeTextEditor || !rl || executingCommand) {
            return;
        }
        executingCommand = true;
        const configuration = vscode.workspace.getConfiguration();
        const input = {
            code: code,
            fileName: fileName,
            useTabs: !vscode.window.activeTextEditor.options.insertSpaces,
            tabSize: vscode.window.activeTextEditor.options.tabSize,
            export: !!configuration.get('csharpToTypeScript.export'),
            convertDatesTo: utilities_1.allowedOrDefault(configuration.get('csharpToTypeScript.convertDatesTo'), input_1.dateOutputTypes),
            convertNullablesTo: utilities_1.allowedOrDefault(configuration.get('csharpToTypeScript.convertNullablesTo'), input_1.nullableOutputTypes),
            toCamelCase: !!configuration.get('csharpToTypeScript.toCamelCase'),
            removeInterfacePrefix: !!configuration.get('csharpToTypeScript.removeInterfacePrefix'),
            generateImports: !!configuration.get('csharpToTypeScript.generateImports'),
            useKebabCase: !!configuration.get('csharpToTypeScript.useKebabCase'),
            appendModelSuffix: !!configuration.get('csharpToTypeScript.appendModelSuffix'),
            quotationMark: utilities_1.allowedOrDefault(configuration.get('csharpToTypeScript.quotationMark'), input_1.quotationMarks)
        };
        const inputLine = JSON.stringify(input) + '\n';
        rl.question(inputLine, (outputLine) => __awaiter(this, void 0, void 0, function* () {
            const { convertedCode, convertedFileName: fileName, succeeded, errorMessage } = JSON.parse(outputLine);
            if (!succeeded) {
                if (errorMessage) {
                    vscode.window.showErrorMessage(`"C# to TypeScript" extension encountered an error while converting your code: "${errorMessage}".`);
                }
                else {
                    vscode.window.showErrorMessage(`"C# to TypeScript" extension encountered an unknown error while converting your code.`);
                }
            }
            else if (!convertedCode) {
                vscode.window.showWarningMessage(`Nothing to convert - C# to TypeScript conversion resulted in an empty string.`);
            }
            else {
                yield onConverted(convertedCode, fileName);
            }
            executingCommand = false;
        }));
    });
}
//# sourceMappingURL=extension.js.map