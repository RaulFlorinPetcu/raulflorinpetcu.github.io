import { Request, Response, Router } from "express";
import multer from "multer";
import InventarController from "../controllers/inventar_controller";
import { verifyToken } from "../misc/AuthMiddleware";


const inventar_router = Router();
const upload = multer({ dest: "./temp" });

inventar_router.post("/import_csv_to_inventar", upload.single("file"), (req: Request, res: Response) => InventarController.import_csv_to_inventar(req, res))
inventar_router.post("/create_inventar", verifyToken, (req: Request, res: Response) => InventarController.create_inventar(req, res));
inventar_router.get("/get_inventare", verifyToken, (req: Request, res: Response) => InventarController.get_inventare(req, res));
inventar_router.post("/get_inventar_products", verifyToken, (req: Request, res: Response) => InventarController.get_inventar_products(req, res));
inventar_router.post("/add_produs", verifyToken, (req: Request, res: Response) => InventarController.add_produs(req, res));
inventar_router.post("/delete_produs", verifyToken, (req: Request, res: Response) => InventarController.delete_produs(req, res));
inventar_router.post("/update_produs", verifyToken, (req: Request, res: Response) => InventarController.update_produs(req, res));
inventar_router.post("/import_products_to_inventar", verifyToken, (req: Request, res: Response) => InventarController.import_products_to_inventar(req, res))
inventar_router.post("/delete_inventar", verifyToken, (req: Request, res: Response) => InventarController.delete_inventar(req, res))
export default inventar_router;