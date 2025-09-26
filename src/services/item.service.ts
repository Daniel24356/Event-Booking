import { Item, ItemState } from "@prisma/client";
import { AddItemDto, AddReportDTO, ReportSeenItemDTO } from "../dtos/item.dto";
import UtilsService from "./utils.service";
import HttpException from "../utils/exception";
import { StatusCodes } from "http-status-codes";
import { gte } from "lodash";
import cloudinary from "../cloudinary";
import { v4 as uuidv4 } from "uuid";

// interface File {
//   path: string;
//   mimetype: string;
// }

export default class ItemService {
  private utils: UtilsService = new UtilsService();

  public async addItem(userId: string, data: any) {
 const {
      itemType,
      name,
      serialNumber,
      imeiNumber,
      shopName,
      purchaseLocation,
      missingData,
      missingLocation,
      purchaseCondition,
      currentCondition,
      description,
      images,
    } = data;

    // Create the new item with related images
    const newItem = await this.utils.dbService.item.create({
      data: {
        userId,
        itemType,
        name,
        serialNumber,
        imeiNumber,
        description,
        purchaseDate: new Date(),
        shopName,
        purchaseLocation,
        purchaseCondition,
        currentCondition,
        missingData: new Date(missingData),
        missingLocation,
        seenLocation: "",
        seenDate: new Date(),
        comment: "",
        review: "",
        additionDetails: "",
        images: {
          create: images.map((image:any) => ({
            url: image.url,
            type: image.type,
          })),
        },
      },
      include: {
        images: true,
      },
    });

    return newItem;
}

  public async getAllItems(): Promise<Item[]> {
    const allItems = await this.utils.dbService.item.findMany({
      include: {
        images: true,
        user: {
          select: {
            firstName:true,
            lastName: true,
            profilePhoto: true,
            state: true,
            city: true,
            createdAt: true,
            items: true
          }
        }
      }
    });
    return allItems;
  }

  public async getUserItems(id: string): Promise<Item[]> {
    const userItems = await this.utils.dbService.item.findMany({
      where: {userId: id},
      include: {
        images: true,
        user: {
          select: {
            firstName:true,
            lastName: true,
            profilePhoto: true,
            state: true,
            city: true,
            createdAt: true,
            items: true
          }
        }
      }
    })
    return userItems;
  }
  
  public async deleteItem(id: string) {
    const findItem = await this.utils.dbService.item.findUnique({
      where: {id}
    });
    if(!findItem){
      throw new HttpException(StatusCodes.BAD_REQUEST, "Item not found");
    }
    await this.utils.dbService.item.delete({
      where: {id}
    })
    
  }
  
public async EditItemDetails(
    id: string,
    data: Partial<AddItemDto>,
    files: { thumbnail?: Express.Multer.File[]; receipt?: Express.Multer.File[] },
    userId: string
  ): Promise<Item> {
    const getItem = await this.utils.dbService.item.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!getItem) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Item not found");
    }
    if (getItem.userId !== userId) {
      throw new HttpException(StatusCodes.FORBIDDEN, "Unauthorized to edit this item");
    }

    const validatedData: Partial<AddItemDto> = {};
    for (const key of Object.keys(data) as (keyof AddItemDto)[]) {
      const value = data[key];
      if (value === undefined) continue;
      if (typeof value === "string" && value.trim() === "") {
        throw new HttpException(StatusCodes.BAD_REQUEST, `${String(key)} cannot be empty`);
      }
      (validatedData as any)[key] = value;
    }

    const imageUpdates: { id: string; url: string; itemId: string; type: string; createdAt: string; updatedAt: string }[] = [];
    if (files.thumbnail) {
      for (const file of files.thumbnail) {
        if (!["image/jpeg", "image/png"].includes(file.mimetype)) {
          throw new HttpException(StatusCodes.BAD_REQUEST, "Invalid thumbnail format");
        }
        const uploadedImage = await cloudinary.uploader.upload(file.path, {
          folder: "thumbnails",
        });
        imageUpdates.push({
          id: uuidv4(),
          url: uploadedImage.secure_url,
          itemId: id,
          type: "thumbnail",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }
    if (files.receipt) {
      for (const file of files.receipt) {
        if (!["image/jpeg", "image/png"].includes(file.mimetype)) {
          throw new HttpException(StatusCodes.BAD_REQUEST, "Invalid receipt format");
        }
        const uploadedImage = await cloudinary.uploader.upload(file.path, {
          folder: "receipts",
        });
        imageUpdates.push({
          id: uuidv4(),
          url: uploadedImage.secure_url,
          itemId: id,
          type: "receipt",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    const editedItem = await this.utils.dbService.item.update({
      where: { id },
      data: {
        ...validatedData,
        updatedAt: new Date().toISOString(),
        images: {
          deleteMany: { type: { in: imageUpdates.map((img) => img.type) } },
          create: imageUpdates,
        },
      },
      include: { images: true },
    });

    return editedItem;
  }

  public async itemViewCount (id: string) {
    const item = await this.utils.dbService.item.findUnique({
      where: {id}
    });
    if(!item) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Item not found");
    }
    await this.utils.dbService.item.update({
      where: {id},
      data: { views: {increment: 1} }
    })
  }
  

  public async itemStatusFilter (filter: ItemState) {
    if(filter === ItemState.All) {
      return await this.utils.dbService.item.findMany({});
    }else{
      return await this.utils.dbService.item.findMany({
        where: { status: filter }
      });
    }
  }

  public async reportSeenItem (data: ReportSeenItemDTO) {
    const report = await this.utils.dbService.seenItemReports.create({data});
  }
  
  public async getItemById(id: string) {
     const items = await this.utils.dbService.item.findFirst({
      where: {id},
      include:{
        images: true
      }
    })
    return items;
  }

  public async addReport (data: AddReportDTO) {
    const newReport = await this.utils.dbService.report.create({ data })
  }

  public async getReportedItems(): Promise<Item[]> {
    const items = await this.utils.dbService.item.findMany({
      where: { reports: { some: {} } },
      include: {
        images: true,
        user: {
          select: {
            firstName:true,
            lastName: true,
            profilePhoto: true,
            state: true,
            city: true,
            createdAt: true,
            items: true
          }
        }
      }
    })
    return items;
  }
  
  public async reportItem() {
    
  }
  
}