import { Router } from "express";
import phoneUser from '..//../controllers/phoneUsers';

const router = Router();

router.route("/all").get(phoneUser.getAllphoneUsers);
router.get("/:id", phoneUser.getphoneUserById);
router.post("/create", phoneUser.createphoneUser);
router.put("/update/:id", phoneUser.updatephoneUser);
router.delete("/delete/:id", phoneUser.deletephoneUser);

export default router;