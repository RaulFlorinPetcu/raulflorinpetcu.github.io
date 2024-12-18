import { Request, Response, Router } from "express";
import UserController from "../controllers/user_controller";

const user_router = Router();

user_router.post("/register_user", (req: Request, res: Response) => UserController.register_user(req, res));
user_router.post("/login_user", (req: Request, res: Response) => UserController.login_user(req, res));

export default user_router;