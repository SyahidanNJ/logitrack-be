const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Ponytail shortcut: verifyToken on all routes
router.use(verifyToken());

router.get("/", notificationController.index);
router.get("/:id", notificationController.show);
router.post("/", notificationController.store);
router.put("/:id", notificationController.update);
router.delete("/:id", notificationController.destroy);

module.exports = router;
