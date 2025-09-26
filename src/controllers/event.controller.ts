import { NextFunction, Request, Response } from 'express';
import EventService from "../services/event.service";
import { StatusCodes } from 'http-status-codes';


export default class EventController {
    private readonly service: EventService = new EventService();

    public getEvents = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const events = await this.service.getAllEvents();
            res.status(StatusCodes.OK).send({
                error: false,
                message: 'Events fetched successful',
                data: events
            });
        } catch (err: any) {
            next(err)
        }
    }

    public createEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const event = await this.service.createEvent(req.body);
            res.status(StatusCodes.OK).json({
                error: false,
                message: 'Event created successful',
                data: event
            });
        } catch (err: any) {
            next(err)
        }
    }
}