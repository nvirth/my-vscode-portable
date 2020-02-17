'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const types_1 = require("./utils/types");
var QuickPickerAction;
(function (QuickPickerAction) {
    QuickPickerAction[QuickPickerAction["noAction"] = 0] = "noAction";
    QuickPickerAction[QuickPickerAction["viewUnixStyle"] = 1] = "viewUnixStyle";
    QuickPickerAction[QuickPickerAction["viewWindowsStyle"] = 2] = "viewWindowsStyle";
    QuickPickerAction[QuickPickerAction["viewFromSystemRoot"] = 3] = "viewFromSystemRoot";
    QuickPickerAction[QuickPickerAction["viewFromWorkSpaceRoot"] = 4] = "viewFromWorkSpaceRoot";
    QuickPickerAction[QuickPickerAction["copy"] = 5] = "copy";
    QuickPickerAction[QuickPickerAction["copyFileName"] = 6] = "copyFileName";
    QuickPickerAction[QuickPickerAction["copyFileNameWithOutExtension"] = 7] = "copyFileNameWithOutExtension";
})(QuickPickerAction = exports.QuickPickerAction || (exports.QuickPickerAction = {}));
class QuickPicker {
    constructor() {
        this._pickItems = [];
    }
    getActionId(currentStyle, isWorkSpace, pathStartsFrom) {
        return __awaiter(this, void 0, void 0, function* () {
            this._pickItems = [];
            if (currentStyle === types_1.PathStyles.UNIX) {
                this._pickItems.push({
                    id: QuickPickerAction.viewWindowsStyle,
                    description: "",
                    label: "Path separator: Windows style",
                    detail: "View on Windows style path"
                });
            }
            else {
                this._pickItems.push({
                    id: QuickPickerAction.viewUnixStyle,
                    description: "",
                    label: "Path separator: UNIX style",
                    detail: "View on UNIX style path"
                });
            }
            if (isWorkSpace) {
                if (pathStartsFrom === types_1.PathStartsFrom.WORK_SPACE) {
                    this._pickItems.push({
                        id: QuickPickerAction.viewFromSystemRoot,
                        description: "",
                        label: "Path starts from: Root",
                        detail: "View from root directory"
                    });
                }
                else {
                    this._pickItems.push({
                        id: QuickPickerAction.viewFromWorkSpaceRoot,
                        description: "",
                        label: "Path starts from: WorkSpace",
                        detail: "View from workspace highest directory"
                    });
                }
            }
            this._pickItems.push({
                id: QuickPickerAction.copy,
                description: "Copy a current file path to clipboard.",
                label: "COPY: Path",
            });
            this._pickItems.push({
                id: QuickPickerAction.copyFileName,
                description: "Copy a current file name to clipboard.",
                label: "COPY: FileName",
            });
            this._pickItems.push({
                id: QuickPickerAction.copyFileNameWithOutExtension,
                description: "Copy a current file name (without extension) to clipboard.",
                label: "COPY: FileName without extension",
            });
            let selectedAction = yield vscode_1.window.showQuickPick(this._pickItems, {
                placeHolder: "Select"
            });
            if (!selectedAction) {
                return QuickPickerAction.noAction;
            }
            return selectedAction.id;
        });
    }
}
exports.QuickPicker = QuickPicker;
//# sourceMappingURL=quickPicker.js.map