import { NextFunction, Request, Response } from 'express';
import BookingService from "../services/booking.service";
import { StatusCodes } from 'http-status-codes';


export default class BookingController {
    private readonly service: BookingService = new BookingService();

    public createBooking = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const booking = await this.service.createBooking(req.body);
            res.status(StatusCodes.OK).json({
                error: false,
                message: "Booking created successful",
                data: booking
            });
        } catch (err: any) {
            next(err)
        }
    }

       public getBookings = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const bookings = await this.service.getBookings();
            res.status(StatusCodes.OK).json({
                error: false,
                message: "Bookings fetched successful",
                data: bookings
            });
        } catch (err: any) {
            next(err)
        }
    }
    


}