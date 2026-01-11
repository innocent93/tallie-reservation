import { Router } from "express";
import { createRestaurant, addTable, getAvailability } from "../controllers/restaurant.controller";
import { auth } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.post("/", auth, authorize(["admin"]), createRestaurant);
router.post("/:id/tables", auth, authorize(["admin"]), addTable);
router.get("/:id/availability", getAvailability);

export default router;
