import _, { some } from "lodash";
import UtilsService from "./utils.service";
import { CreateAdminDto } from "../dtos/createAdmin.dto";
import { AccountStatus, AdminRole, Item, ItemState } from "@prisma/client";
import HttpException from "../utils/exception";
import { StatusCodes } from "http-status-codes";

export default class AdminService {
  private utils: UtilsService = new UtilsService();

 public async createAdmin(adminData: CreateAdminDto, userId: string) {
    const {
      adminTitle,
      adminname,
      email,
      phoneNumber,
      state,
      city,
      address,
      role,
      status,
    } = adminData;

    // Check if the authenticated user has createAdmins permission
    const user = await this.utils.dbService.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      throw new HttpException(StatusCodes.UNAUTHORIZED, "Unauthorized: User not found");
    }

    if (user.role !== "SuperAdmin") {
      throw new HttpException(
        StatusCodes.FORBIDDEN,
        "Forbidden: Insufficient permissions for createAdmins"
      );
    }

    // Check if email is already in use
     const existingUser = await this.utils.dbService.user.findFirst({
      where: {
        email
      }
    });

    if (existingUser) {
      throw new HttpException(StatusCodes.BAD_REQUEST, "Email already in use");
    }

    // Create new admin
    const newAdmin = await this.utils.dbService.admin.create({
      data: {
        adminTitle,
        adminname,
        email,
        phoneNumber,
        state,
        city,
        address,
        role: role || "CustomerCare", // Default to "Admin" if not provided
        status,
        userId
      },
    });

    return newAdmin;
  }

  public async getAllUsers() {
    const users = await this.utils.dbService.user.findMany({
      include: { items: true },
    });

    return users.map((user) =>
      _.omit(user, [
        "password",
        "securityQuestionOne",
        "securityQuestionTwo",
        "securityAnswerOne",
        "securityAnswerTwo",
      ])
    );
  }

  public async getAllAdmins() {
    return await this.utils.dbService.user.findMany({
      where: { role: { in: ["Admin", "SuperAdmin"] } },
    });
  }

  public async editAdminDetails(adminId: string, adminDetails: any, permissions: string[]) {
    const updatedAdmin = await this.utils.dbService.user.update({
      where: { id: adminId },
      data: {
        ...adminDetails,
        permissions, // Directly update permissions as String[]
      },
    });

    return updatedAdmin;
  }

  public async getAdminById(id: string) {
    const admin = await this.utils.dbService.user.findFirst({
      where: {
        id,
        role: { in: ["Admin", "SuperAdmin"] },
      },
    });

    if (!admin) {
      throw new HttpException(StatusCodes.BAD_REQUEST, "User not found");
    }

    return admin;
  }

  public async getProcessingItems(): Promise<Item[]> {
    return await this.utils.dbService.item.findMany({
      where: { status: ItemState.Processing },
    });
  }

  public async getTopLocations() {
    return await this.utils.dbService.item.groupBy({
      by: ["missingLocation"],
      _count: { missingLocation: true },
      orderBy: { _count: { missingLocation: "desc" } },
      take: 8,
    });
  }

  public async getTopReporters() {
    return await this.utils.dbService.user.findMany({
      where: { Report: { some: {} } },
      select: {
        firstName: true,
        lastName: true,
        username: true,
        profilePhoto: true,
        _count: { select: { Report: true } },
      },
      orderBy: { Report: { _count: "desc" } },
      take: 8,
    });
  }

  public async deleteItem(id: string) {
    return await this.utils.dbService.item.delete({
      where: { id },
    });
  }

  public async approveItem(id: string) {
    const item = await this.utils.dbService.item.findUnique({
      where: { id },
    });
    if (!item) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Item not found");
    }
    await this.utils.dbService.item.update({
      where: { id },
      data: {
        status: ItemState.Investigating,
      },
    });
  }

  public async getAllItems() {
    return await this.utils.dbService.item.findMany({
      select: { name: true },
    });
  }

  public async getFiveItems() {
    return await this.utils.dbService.item.findMany({
      take: 5,
    });
  }

  public async getUsersList() {
    return await this.utils.dbService.user.findMany({
      select: {
        firstName: true,
        accountStatus: true,
      },
    });
  }
}