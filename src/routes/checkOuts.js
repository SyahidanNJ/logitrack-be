const express = require("express");
const router = express.Router();
const checkOutController = require("../controllers/checkOutController");
const { verifyToken } = require("../middlewares/authMiddleware");

const upload = require("../middlewares/uploadMiddleware");

// Ponytail shortcut: verifyToken on all routes
router.use(verifyToken());

router.get("/", checkOutController.index);
router.get("/:id", checkOutController.show);
router.post("/", upload.single("document_file"), checkOutController.store);
router.put("/:id", upload.single("document_file"), checkOutController.update);
router.delete("/:id", checkOutController.destroy);

module.exports = router;
