"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConsoleLogger {
    static log_message(message) {
        const timestamp = new Date().toDateString() + " " + new Date().toLocaleTimeString();
        console.log(`[${message.type} | ${timestamp}]: ${message.text}`);
    }
    static log_warning_message(message) {
        const timestamp = new Date().toDateString() + " " + new Date().toLocaleTimeString();
        console.log(`\x1b[33m[${message.type} | ${timestamp}]: ${message.text} \x1b[0m`);
    }
    static log_error_message(message) {
        const timestamp = new Date().toDateString() + " " + new Date().toLocaleTimeString();
        console.log(`\x1b[31m${message} | ${timestamp} \x1b[0m`);
    }
    static log_error_stack(message) {
        const timestamp = new Date().toDateString() + " " + new Date().toLocaleTimeString();
        console.log(`\x1b[31m${message} | ${timestamp} \x1b[0m`);
    }
}
;
exports.default = ConsoleLogger;
