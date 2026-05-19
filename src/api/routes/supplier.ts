import { Router } from "express";
import supplier from '../../controllers/suppliers';

const router = Router();

router.route("/all").get(supplier.getAllSuppliers);
router.get("/:id", supplier.getSupplierById);
router.post("/create", supplier.createSupplier);
router.put("/update/:id", supplier.updateSupplier);
router.delete("/delete/:id", supplier.deleteSupplier);

export default router;