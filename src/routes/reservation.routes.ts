import { Router } from "express";
import { createReservation } from "../controllers/reservation.controller";

const router = Router();
router.post("/", createReservation);
export default router;
