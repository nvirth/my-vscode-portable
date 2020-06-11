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
const cp = require("child_process");
const path = require("path");
const vscode = require("vscode");
const utils = require("./utils");
class PowerShellProcess {
    constructor(exePath, bundledModulesPath, title, log, startPsesArgs, sessionFilePath, sessionSettings) {
        this.exePath = exePath;
        this.bundledModulesPath = bundledModulesPath;
        this.title = title;
        this.log = log;
        this.startPsesArgs = startPsesArgs;
        this.sessionFilePath = sessionFilePath;
        this.sessionSettings = sessionSettings;
        this.onExitedEmitter = new vscode.EventEmitter();
        this.consoleTerminal = undefined;
        this.onExited = this.onExitedEmitter.event;
    }
    static escapeSingleQuotes(pspath) {
        return pspath.replace(new RegExp("'", "g"), "''");
    }
    start(logFileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const editorServicesLogPath = this.log.getLogFilePath(logFileName);
            const psesModulePath = path.resolve(__dirname, this.bundledModulesPath, "PowerShellEditorServices/PowerShellEditorServices.psd1");
            const featureFlags = this.sessionSettings.developer.featureFlags !== undefined
                ? this.sessionSettings.developer.featureFlags.map((f) => `'${f}'`).join(", ")
                : "";
            this.startPsesArgs +=
                `-LogPath '${PowerShellProcess.escapeSingleQuotes(editorServicesLogPath)}' ` +
                    `-SessionDetailsPath '${PowerShellProcess.escapeSingleQuotes(this.sessionFilePath)}' ` +
                    `-FeatureFlags @(${featureFlags}) `;
            if (this.sessionSettings.integratedConsole.useLegacyReadLine) {
                this.startPsesArgs += "-UseLegacyReadLine";
            }
            const powerShellArgs = [];
            const useLoginShell = (utils.isMacOS && this.sessionSettings.startAsLoginShell.osx)
                || (utils.isLinux && this.sessionSettings.startAsLoginShell.linux);
            if (useLoginShell && this.isLoginShell(this.exePath)) {
                // This MUST be the first argument.
                powerShellArgs.push("-Login");
            }
            powerShellArgs.push("-NoProfile");
            powerShellArgs.push("-NonInteractive");
            // Only add ExecutionPolicy param on Windows
            if (utils.isWindows) {
                powerShellArgs.push("-ExecutionPolicy", "Bypass");
            }
            const startEditorServices = "Import-Module '" +
                PowerShellProcess.escapeSingleQuotes(psesModulePath) +
                "'; Start-EditorServices " + this.startPsesArgs;
            if (utils.isWindows) {
                powerShellArgs.push("-Command", startEditorServices);
            }
            else {
                // Use -EncodedCommand for better quote support on non-Windows
                powerShellArgs.push("-EncodedCommand", Buffer.from(startEditorServices, "utf16le").toString("base64"));
            }
            this.log.write("Language server starting --", "    PowerShell executable: " + this.exePath, "    PowerShell args: " + powerShellArgs.join(" "), "    PowerShell Editor Services args: " + startEditorServices);
            // Make sure no old session file exists
            utils.deleteSessionFile(this.sessionFilePath);
            // Launch PowerShell in the integrated terminal
            this.consoleTerminal =
                vscode.window.createTerminal({
                    name: this.title,
                    shellPath: this.exePath,
                    shellArgs: powerShellArgs,
                    hideFromUser: !this.sessionSettings.integratedConsole.showOnStartup,
                });
            const pwshName = path.basename(this.exePath);
            this.log.write(`${pwshName} started.`);
            if (this.sessionSettings.integratedConsole.showOnStartup) {
                // We still need to run this to set the active terminal to the Integrated Console.
                this.consoleTerminal.show(true);
            }
            // Start the language client
            this.log.write("Waiting for session file");
            const sessionDetails = yield this.waitForSessionFile();
            // Subscribe a log event for when the terminal closes
            this.log.write("Registering terminal close callback");
            this.consoleCloseSubscription = vscode.window.onDidCloseTerminal((terminal) => this.onTerminalClose(terminal));
            // Log that the PowerShell terminal process has been started
            this.log.write("Registering terminal PID log callback");
            this.consoleTerminal.processId.then((pid) => this.logTerminalPid(pid, pwshName));
            return sessionDetails;
        });
    }
    showConsole(preserveFocus) {
        if (this.consoleTerminal) {
            this.consoleTerminal.show(preserveFocus);
        }
    }
    dispose() {
        // Clean up the session file
        utils.deleteSessionFile(this.sessionFilePath);
        if (this.consoleCloseSubscription) {
            this.consoleCloseSubscription.dispose();
            this.consoleCloseSubscription = undefined;
        }
        if (this.consoleTerminal) {
            this.log.write("Terminating PowerShell process...");
            this.consoleTerminal.dispose();
            this.consoleTerminal = undefined;
        }
    }
    logTerminalPid(pid, exeName) {
        this.log.write(`${exeName} PID: ${pid}`);
    }
    isLoginShell(pwshPath) {
        try {
            // We can't know what version of PowerShell we have without running it
            // So we try to start PowerShell with -Login
            // If it exits successfully, we return true
            // If it exits unsuccessfully, node throws, we catch, and return false
            cp.execFileSync(pwshPath, ["-Login", "-NoProfile", "-NoLogo", "-Command", "exit 0"]);
        }
        catch (_a) {
            return false;
        }
        return true;
    }
    waitForSessionFile() {
        return new Promise((resolve, reject) => {
            utils.waitForSessionFile(this.sessionFilePath, (sessionDetails, error) => {
                utils.deleteSessionFile(this.sessionFilePath);
                if (error) {
                    this.log.write(`Error occurred retrieving session file:\n${error}`);
                    return reject(error);
                }
                this.log.write("Session file found");
                resolve(sessionDetails);
            });
        });
    }
    onTerminalClose(terminal) {
        if (terminal !== this.consoleTerminal) {
            return;
        }
        this.log.write("powershell.exe terminated or terminal UI was closed");
        this.onExitedEmitter.fire();
    }
}
exports.PowerShellProcess = PowerShellProcess;
//# sourceMappingURL=process.js.map