import { Router } from "express";
import supplierCategory from '../../controllers/supplierCategories';

const router = Router();

router.route("/all").get(supplierCategory.getAllSupplierCategories);
router.get("/:proveedor_id/:categoria_id", supplierCategory.getSupplierCategoryById);
router.post("/create", supplierCategory.createSupplierCategory);
router.put("/update/:proveedor_id/:categoria_id", supplierCategory.updateSupplierCategory);
router.delete("/delete/:proveedor_id/:categoria_id", supplierCategory.deleteSupplierCategory);

export default router;