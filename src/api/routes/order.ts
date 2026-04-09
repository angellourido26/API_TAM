import { Router } from "express";
import order from '../../controllers/orders';

const router = Router();

router.route("/all").get(order.getAllOrders);
router.get("/:id", order.getOrderById);
router.post("/create", order.createOrder);
router.put("/update/:id", order.updateOrder);
router.delete("/delete/:id", order.deleteOrder);

export default router;