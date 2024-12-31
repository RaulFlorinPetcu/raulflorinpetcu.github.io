// Dependencies
import "reflect-metadata";
import express  from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import misc_router from './routes/misc_router';
import inventar_router from './routes/inventar_router';
import user_router from './routes/user_router';
import pdf_router from "./routes/pdf_router";
import { Request, Response } from "express";

// Server Setup - Initialization
const app = express();

// Server Setup - Config
app.use(cors({origin: "*"}));
app.use(bodyParser.json({limit: "50mb"}));

// Server Setup - Routes
app.use("", misc_router);
app.use("", inventar_router);
app.use("", user_router);
app.use("", pdf_router)

export default app;