const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Ponytail shortcut: verifyToken on all routes
router.use(verifyToken());

router.get("/", dashboardController.index);
router.get("/:id", dashboardController.show);
router.post("/", dashboardController.store);
router.put("/:id", dashboardController.update);
router.delete("/:id", dashboardController.destroy);

module.exports = router;
