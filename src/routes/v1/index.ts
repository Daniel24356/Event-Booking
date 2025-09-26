import express from 'express';
import authRouter from './auth.route';
import userRouter from './user.route';
import eventRouter from './event.route'
import bookingRouter from './booking.route'

const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/event', eventRouter);
router.use('/booking', bookingRouter)

export default router;