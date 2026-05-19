import { Router } from "express";
import auth from '../../controllers/auth';

const router = Router();

router.post("/login", auth.login);
router.post("/register", auth.register);

export default router;