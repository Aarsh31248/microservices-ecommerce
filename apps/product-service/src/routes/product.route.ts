import { Router } from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controller";

const router: Router = Router();

router.post("/", createProduct);
router.put("/:id", updateProduct);
router.get("/", getProducts);

export default router;
