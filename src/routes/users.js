const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Ponytail shortcut: verifyToken on all routes
router.use(verifyToken());

router.get("/", userController.index);
router.get("/employees/all", userController.getEmployees);
router.get("/:id", userController.show);
router.post("/", userController.store);
router.put("/:id", userController.update);
router.delete("/:id", userController.destroy);

module.exports = router;
