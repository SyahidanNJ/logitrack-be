const express = require("express");
const router = express.Router();
const documentController = require("../controllers/documentController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.use(verifyToken());

router.get("/", documentController.index);
router.get("/:id", documentController.show);
router.post("/", documentController.store);
router.put("/:id", documentController.update);
router.delete("/:id", documentController.destroy);

module.exports = router;
