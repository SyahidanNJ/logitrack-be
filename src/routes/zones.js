const express = require("express");
const router = express.Router();
const zoneController = require("../controllers/zoneController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { validate } = require("../middlewares/validator");
const { createZoneSchema, updateZoneSchema } = require("../validators/schema");

router.get("/", verifyToken(), zoneController.index);
router.get("/:id", verifyToken(), zoneController.show);
router.post("/", verifyToken(["supervisor", "manager", "superadmin"]), validate(createZoneSchema), zoneController.store);
router.put("/:id", verifyToken(["supervisor", "manager", "superadmin"]), validate(updateZoneSchema), zoneController.update);
router.delete("/:id", verifyToken(["manager", "superadmin"]), zoneController.destroy);

module.exports = router;
