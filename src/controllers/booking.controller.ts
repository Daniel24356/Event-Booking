import { NextFunction, Request, Response } from "express";
import BookingService from "../services/booking.service";
import { StatusCodes } from "http-status-codes";

export default class BookingController {
  private readonly service: BookingService = new BookingService();

  public createBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id; // comes from auth middleware
      if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          error: true,
          message: "Unauthorized",
        });
      }

      const booking = await this.service.createBooking(userId, req.body);

      res.status(StatusCodes.OK).json({
        error: false,
        message: "Booking created successfully",
        data: booking,
      });
    } catch (err: any) {
      next(err);
    }
  };

  public getBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookings = await this.service.getBookings();
      res.status(StatusCodes.OK).json({
        error: false,
        message: "Bookings fetched successfully",
        data: bookings,
      });
    } catch (err: any) {
      next(err);
    }
  };
}
