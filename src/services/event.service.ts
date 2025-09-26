import { orderBy } from "lodash";
import UtilsService from "./utils.service";


export default class EventService {
    private utils: UtilsService = new UtilsService()
    
    public async getAllEvents(){
        return await this.utils.dbService.event.findMany({
            orderBy: {createdAt: "desc"}
        })
    }

    
}