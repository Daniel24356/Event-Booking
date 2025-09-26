import { orderBy } from "lodash";
import UtilsService from "./utils.service";
import { CreateEventDTO } from "../dtos/event.dto";


export default class EventService {
    private utils: UtilsService = new UtilsService()
    
    public async getAllEvents(){
        return await this.utils.dbService.event.findMany({
            orderBy: {createdAt: "desc"}
        })
    }

    public async createEvent(data: CreateEventDTO){
        return await this.utils.dbService.event.create({
            data,
        })
    }
}