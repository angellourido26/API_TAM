import { Router } from "express";
import supplierPhone from '../../controllers/supplierPhones';

const router = Router();

router.route("/all").get(supplierPhone.getAllSupplierPhones);
router.get("/:id", supplierPhone.getSupplierPhoneById);
router.post("/create", supplierPhone.createSupplierPhone);
router.put("/update/:id", supplierPhone.updateSupplierPhone);
router.delete("/delete/:id", supplierPhone.deleteSupplierPhone);

export default router;