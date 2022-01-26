import { Router } from "express";
import { generateNMockProduct } from "../utils/mockProduct.js";

const router = Router();

router.get("/productos-test", (req, res) => {
  res.json(generateNMockProduct(5));
});

export default router;
