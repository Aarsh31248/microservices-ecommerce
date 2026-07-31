import { Router } from "express";
import {
  createProduct,
  updateProduct,
} from "../controllers/product.controller";

const router: Router = Router();

router.post("/", createProduct);
router.put("/:id", updateProduct);

export default router;
