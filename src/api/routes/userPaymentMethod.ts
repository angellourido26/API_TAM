import { Router } from "express";
import userPaymentMethod from '../../controllers/userPaymentMethods';

const router = Router();

router.route("/all").get(userPaymentMethod.getAllUserPaymentMethods);
router.get("/:id", userPaymentMethod.getUserPaymentMethodById);
router.post("/create", userPaymentMethod.createUserPaymentMethod);
router.put("/update/:id", userPaymentMethod.updateUserPaymentMethod);
router.delete("/delete/:id", userPaymentMethod.deleteUserPaymentMethod);

export default router;