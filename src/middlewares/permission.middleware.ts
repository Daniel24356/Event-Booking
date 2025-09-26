import { RequestHandler, Response, NextFunction } from "express";
import HttpException from "../lib/errors";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest } from "../interfaces";
import UtilsService from "../services/utils.service";
import { UserRole } from "@prisma/client";

const utils = new UtilsService();

function requirePermission(permission: string): RequestHandler {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.session.user?.id;

    if (!userId) {
      throw new HttpException(
        StatusCodes.UNAUTHORIZED,
        "Unauthorized: User ID not found"
      );
    }

    const user = await utils.dbService.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      throw new HttpException(
        StatusCodes.UNAUTHORIZED,
        "Unauthorized: User not found"
      );
    }

    // SuperAdmins bypass permission checks
    if (user.role === UserRole.SuperAdmin) {
      return next();
    }

    // Ensure user is an admin
    if (user.role !== UserRole.Admin) {
      throw new HttpException(
        StatusCodes.UNAUTHORIZED,
        "Unauthorized: Admin privileges required"
      );
    }

    // Check if user has the required permission
    // if (!user.permissions.includes(permission)) {
    //   throw new HttpException(
    //     StatusCodes.FORBIDDEN,
    //     `Forbidden: Insufficient permissions for ${permission}`
    //   );
    // }

    return next();
  };
}

export default requirePermission;