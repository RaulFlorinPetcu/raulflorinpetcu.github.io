interface ConsoleLoggerMessage {
    type: "SERVER" | "SERVER - ERROR",
    text: string
}

class ConsoleLogger {
    static log_message(message: ConsoleLoggerMessage) {
        const timestamp = new Date().toDateString() + " " + new Date().toLocaleTimeString();
        console.log(`[${message.type} | ${timestamp}]: ${message.text}`)
    }
    static log_warning_message(message: ConsoleLoggerMessage) {
        const timestamp = new Date().toDateString() + " " + new Date().toLocaleTimeString();
        console.log(`\x1b[33m[${message.type} | ${timestamp}]: ${message.text} \x1b[0m`)
    }
    static log_error_message(message: string) {
        const timestamp = new Date().toDateString() + " " + new Date().toLocaleTimeString();
        console.log(`\x1b[31m${message} | ${timestamp} \x1b[0m`)
    }
    static log_error_stack(message: any) {
        const timestamp = new Date().toDateString() + " " + new Date().toLocaleTimeString();
        console.log(`\x1b[31m${message} | ${timestamp} \x1b[0m`)
    }
};

export {ConsoleLoggerMessage};
export default ConsoleLogger;