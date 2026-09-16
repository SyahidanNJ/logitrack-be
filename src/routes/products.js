const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Ponytail shortcut: verifyToken on all routes
router.use(verifyToken());

router.get("/", productController.index);
router.get("/:id", productController.show);
router.post("/", productController.store);
router.put("/:id", productController.update);
router.delete("/:id", productController.destroy);

module.exports = router;
