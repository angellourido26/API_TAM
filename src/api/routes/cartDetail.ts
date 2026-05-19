import { Router } from "express";
import cartDetail from "../../controllers/cartDetails";

const router = Router();
router.route("/all").get(cartDetail.getAllCartDetails);
router.get("/:id", cartDetail.getCartDetailById);
router.post("/create", cartDetail.createCartDetail);
router.put("/update/:id", cartDetail.updateCartDetail);
router.delete("/delete/:id", cartDetail.deleteCartDetail);

export default router;