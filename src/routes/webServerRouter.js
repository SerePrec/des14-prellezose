import { Router } from "express";
import { isAuthWeb } from "../middlewares/auth.js";
import * as controller from "../controllers/webServerController.js";

const router = Router();

router.get("/", isAuthWeb, controller.getHome);

router.get("/productos-mock", isAuthWeb, controller.getProductosMock);

export default router;
