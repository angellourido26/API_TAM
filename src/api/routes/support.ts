import { Router } from "express";
import support from '../../controllers/support';

const router = Router();

router.route("/all").get(support.getAllSupport);
router.get("/:id", support.getSupportById);
router.post("/create", support.createSupport);
router.put("/update/:id", support.updateSupport);
router.delete("/delete/:id", support.deleteSupport);

export default router;