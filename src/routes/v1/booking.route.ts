import express from "express";
import BookingController from "../../controllers/booking.controller";
import authMiddleware from "../../middlewares/auth.middleware";

const router = express.Router();
const controller = new BookingController();

router.get("/", authMiddleware, controller.getBookingsByUser);

router.post("/", authMiddleware, controller.createBooking);

export default router;

