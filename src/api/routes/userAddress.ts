import { Router } from "express";
import userAddress from '../../controllers/userAddresses';

const router = Router();

router.route("/all").get(userAddress.getAllUserAddresses);
router.get("/:id", userAddress.getUserAddressById);
router.post("/create", userAddress.createUserAddress);
router.put("/update/:id", userAddress.updateUserAddress);
router.delete("/delete/:id", userAddress.deleteUserAddress);

export default router;