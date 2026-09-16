const express = require("express");
const router = express.Router();
const binLocationController = require("../controllers/binLocationController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Ponytail shortcut: verifyToken on all routes
router.use(verifyToken());

router.get("/", binLocationController.index);
router.get("/:id", binLocationController.show);
router.post("/", binLocationController.store);
router.put("/:id", binLocationController.update);
router.delete("/:id", binLocationController.destroy);

module.exports = router;
