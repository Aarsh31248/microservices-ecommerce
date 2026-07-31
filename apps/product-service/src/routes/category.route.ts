import { Router } from "express";
import {
  createCategory,
  updateCategory,
} from "../controllers/category.controller";

const router: Router = Router();

router.post("/", createCategory);
router.put("/:id", updateCategory);

export default router;
