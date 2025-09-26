import { NextFunction, Request, Response } from 'express';
import EventService from "../services/event.service";


export default class EventController {
private readonly service: EventService = new EventService();  

public getEvents = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const events = await this.service.getAllEvents();
      res.json(events);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
}


}