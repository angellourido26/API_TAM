import { Router } from "express";
import category from '../../controllers/categories';

const router = Router();

router.route("/all").get(category.getAllCategories);
router.get("/:id", category.getCategoryById);
router.post("/create", category.createCategory);
router.put("/update/:id", category.updateCategory);
router.delete("/delete/:id", category.deleteCategory);

export default router;