import { Router } from "express";
import role from '../../controllers/roles';

const router = Router();

router.route("/all").get(role.getAllRoles);
router.get("/:id", role.getRoleById);
router.post("/create", role.createRole);
router.put("/update/:id", role.updateRole);
router.delete("/delete/:id", role.deleteRole);

export default router;