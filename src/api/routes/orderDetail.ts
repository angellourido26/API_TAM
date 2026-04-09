import { Router } from "express";
import detail from '../../controllers/orderDetails';

const router = Router();

router.route("/all").get(detail.getAllOrderDetails);
router.get("/:id", detail.getOrderDetailById);
router.post("/create", detail.createOrderDetail);
router.put("/update/:id", detail.updateOrderDetail);
router.delete("/delete/:id", detail.deleteOrderDetail);

export default router;