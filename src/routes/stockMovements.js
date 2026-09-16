const express = require("express");
const router = express.Router();
const stockMovementController = require("../controllers/stockMovementController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Ponytail shortcut: verifyToken on all routes
router.use(verifyToken());

router.get("/", stockMovementController.index);
router.get("/:id", stockMovementController.show);
router.post("/", stockMovementController.store);
router.put("/:id", stockMovementController.update);
router.delete("/:id", stockMovementController.destroy);

module.exports = router;
