// Dependencies
import express  from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';


// Inter Dependencies
import ServerDataSource from './data_source';
import ConsoleLogger from './misc/ConsoleLogger';
import { AnyError } from 'typeorm';
import misc_router from './routes/misc_router';
import inventar_router from './routes/inventar_router';
import user_router from './routes/user_router';

// Server Setup
// Server Setup - Initialization
const app = express();
const port = 5000;

// Server Setup - Config
app.use(cors({origin: "*"}));
app.use(bodyParser.json());

// Server Setup - Routes
app.use("", misc_router);
app.use("", inventar_router);
app.use("", user_router);

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
});
    