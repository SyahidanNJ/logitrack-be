const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stockController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Ponytail shortcut: verifyToken on all routes
router.use(verifyToken());

router.get("/", stockController.index);
router.get("/:id", stockController.show);
router.post("/", stockController.store);
router.put("/:id", stockController.update);
router.delete("/:id", stockController.destroy);

module.exports = router;
