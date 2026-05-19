import { Router } from "express";
import actionControl from '../../controllers/actionControls';

const router = Router();
router.route("/all").get(actionControl.getAllActionControls);
router.get("/:id", actionControl.getActionControlById);
router.post("/create", actionControl.createActionControl);
router.put("/update/:id", actionControl.updateActionControl);
router.delete("/delete/:id", actionControl.deleteActionControl);

export default router;