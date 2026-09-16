const express = require("express");
const router = express.Router();
const warehouseController = require("../controllers/warehouseController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { validate } = require("../middlewares/validator");
const { createWarehouseSchema, updateWarehouseSchema } = require("../validators/schema");

router.get("/", verifyToken(), warehouseController.index);
router.get("/:id", verifyToken(), warehouseController.show);
router.post("/", verifyToken(["supervisor", "manager", "superadmin"]), validate(createWarehouseSchema), warehouseController.store);
router.put("/:id", verifyToken(["supervisor", "manager", "superadmin"]), validate(updateWarehouseSchema), warehouseController.update);
router.delete("/:id", verifyToken(["manager", "superadmin"]), warehouseController.destroy);

module.exports = router;
