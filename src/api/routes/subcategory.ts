import { Router } from "express";
import subcategory from '../../controllers/subcategories';

const router = Router();

router.route("/all").get(subcategory.getAllSubcategories);
router.get("/:id", subcategory.getSubcategoryById);
router.post("/create", subcategory.createSubcategory);
router.put("/update/:id", subcategory.updateSubcategory);
router.delete("/delete/:id", subcategory.deleteSubcategory);

export default router;