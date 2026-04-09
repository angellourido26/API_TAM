import { Router } from "express";
import user from '../../controllers/users';

const router = Router();

router.route("/all").get(user.getAllUsers);
router.get("/:id", user.getUserById);
router.post("/create", user.createUser);
router.put("/update/:id", user.updateUser);
router.delete("/delete/:id", user.deleteUser);

export default router;