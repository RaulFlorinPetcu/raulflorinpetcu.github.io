import { NextFunction, Request, Response, Router } from "express";
import PdfController from "../controllers/pdf_controller";

const pdf_router = Router();

pdf_router.post('/download_pdf', (req: Request, res: Response) => PdfController.generate_pdf(req, res));

export default pdf_router;