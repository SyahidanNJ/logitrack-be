const express = require("express");
const router = express.Router();
const checkInController = require("../controllers/checkInController");
const { verifyToken } = require("../middlewares/authMiddleware");

const upload = require("../middlewares/uploadMiddleware");

// Ponytail shortcut: verifyToken on all routes
router.use(verifyToken());

router.get("/", checkInController.index);
router.get("/:id", checkInController.show);
router.post("/", upload.single("document_file"), checkInController.store);
router.put("/:id", upload.single("document_file"), checkInController.update);
router.delete("/:id", checkInController.destroy);

module.exports = router;
