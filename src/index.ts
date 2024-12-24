// Inter Dependencies
import "reflect-metadata";
import ServerDataSource from './data_source';
import ConsoleLogger from './misc/ConsoleLogger';
import { AnyError } from 'typeorm';
import app from './app';


// Server Setup
const port = 5000;



// Server Start Up
ConsoleLogger.log_message({type: "SERVER", text: "Launching..."});

ServerDataSource.initialize()
    .then(() => {
        ConsoleLogger.log_message({type: "SERVER", text: "Database initialized - starting server..."});

        app.listen(port, () => {
            ConsoleLogger.log_message({type: "SERVER", text: `Server started on http://localhost:${port}`});
        })
    })
    .catch((err: AnyError) => {
        ConsoleLogger.log_warning_message({type: "SERVER - ERROR", text: "Database could not be initialized, read the error below or in the system logs."});
        ConsoleLogger.log_error_message(err.message);
        ConsoleLogger.log_error_stack(err.stack);
        console.log(err)
    });
    