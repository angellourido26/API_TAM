import { Router } from "express";
import cart from "../../controllers/carts";

const router = Router();
router.route("/all").get(cart.getAllCarts);
router.get("/:id", cart.getCartById);
router.post("/create", cart.createCart);
router.put("/update/:id", cart.updateCart);
router.delete("/delete/:id", cart.deleteCart);

export default router;