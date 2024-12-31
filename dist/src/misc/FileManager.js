"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class FileManager {
    static delete_file(file_path) {
        fs_1.default.unlink(file_path, (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
}
exports.default = FileManager;
