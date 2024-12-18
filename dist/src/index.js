"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Inter Dependencies
require("reflect-metadata");
const data_source_1 = __importDefault(require("./data_source"));
const ConsoleLogger_1 = __importDefault(require("./misc/ConsoleLogger"));
const app_1 = __importDefault(require("./app"));
// Server Setup
const port = 5000;
// Server Start Up
ConsoleLogger_1.default.log_message({ type: "SERVER", text: "Launching..." });
data_source_1.default.initialize()
    .then(() => {
    ConsoleLogger_1.default.log_message({ type: "SERVER", text: "Database initialized - starting server..." });
    app_1.default.listen(port, () => {
        ConsoleLogger_1.default.log_message({ type: "SERVER", text: `Server started on http://localhost:${port}` });
    });
})
    .catch((err) => {
    ConsoleLogger_1.default.log_warning_message({ type: "SERVER - ERROR", text: "Database could not be initialized, read the error below or in the system logs." });
    ConsoleLogger_1.default.log_error_message(err.message);
    ConsoleLogger_1.default.log_error_stack(err.stack);
});
