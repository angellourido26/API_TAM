import { NextFunction, Request, Response, Router } from "express";
import product from '../../controllers/products';

const router = Router();

router.route("/all").get(product.getAllProducts);
router.get("/:id", product.getProductById);
router.post("/create", product.createProduct);
router.put("/update/:id", product.updateProduct);
router.delete("/delete/:id", product.deleteProduct);

export default router;
