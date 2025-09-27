import { StatusCodes } from "http-status-codes";
import { CreateBookingDTO } from "../dtos/booking.dto";
import HttpException from "../utils/exception";
import UtilsService from "./utils.service";

export default class BookingService {
  private utils: UtilsService = new UtilsService();

  public async createBooking(userId: string, data: CreateBookingDTO) {
    const event = await this.utils.dbService.event.findUnique({
      where: { id: data.eventId },
    });

    if (!event) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        "Event not found"
      );
    }

    return await this.utils.dbService.booking.create({
      data: {
        eventId: data.eventId,
        userId,
      },
    });
  }

 public async getBookingsByUser(userId: string) {
  return await this.utils.dbService.booking.findMany({
    where: {
      userId,
    },
    include: {
      event: true,
      user: true,
    },
  });
}

}
