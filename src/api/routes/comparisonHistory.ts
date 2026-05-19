import { Router } from "express";
import comparisonHistory from '../../controllers/comparisonHistories';

const router = Router();

router.route("/all").get(comparisonHistory.getAllComparisonHistories);
router.get("/:id", comparisonHistory.getComparisonHistoryById);
router.post("/create", comparisonHistory.createComparisonHistory);
router.put("/update/:id", comparisonHistory.updateComparisonHistory);
router.delete("/delete/:id", comparisonHistory.deleteComparisonHistory);

export default router;