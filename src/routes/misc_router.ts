import { Router, Response, Request } from "express";

const misc_router = Router();

misc_router.get("", (req: Request, res: Response) => {res.send("API of PFR")})

export default misc_router;