import { Router } from "express";
import calification from "../../controllers/califications";

const router = Router();
router.route("/all").get(calification.getAllCalifications);
router.get("/:id", calification.getCalificationById);
router.post("/create", calification.createCalification);
router.put("/update/:id", calification.updateCalification);
router.delete("/delete/:id", calification.deleteCalification);

export default router;