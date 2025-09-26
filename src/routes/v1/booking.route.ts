
import express from 'express';
import BookingController from '../../controllers/booking.controller';

const router = express.Router();
const controller = new BookingController();

router.get(
  '/',
  controller.getBookings
);

router.post(
  '/',
  controller.createBooking
);

export default router