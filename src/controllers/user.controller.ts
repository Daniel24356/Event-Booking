import { NextFunction, Request, Response } from 'express';
import UserService from '../services/user.service';
import { StatusCodes } from 'http-status-codes';
import { AuthenticatedRequest } from '../interfaces';
import { ChangePasswordDto } from '../dtos/user.dto';

export default class UserController {
  private readonly service: UserService = new UserService();

  public getProfile = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
    const res = await this.service.getProfile(request.session.user.id);
    response.status(StatusCodes.OK).send({
      error: false,
      message: 'Profile fetched successful',
      data: res
    });
  };

 public updateProfile = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
  try {
    const res = await this.service.updateProfile(
      request.session.user.id, // userId
      request.body              // dto
    );

    response.status(StatusCodes.OK).send({
      error: false,
      message: 'Profile updated successfully',
      data: res
    });
  } catch (error) {
    next(error); // pass any error to the error handler middleware
  }
};

 public updateUserById = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
  try {
    const res = await this.service.updateProfile(
      request.params.id, // userId
      request.body              // dto
    );

    response.status(StatusCodes.OK).send({
      error: false,
      message: 'Profile updated successfully',
      data: res
    });
  } catch (error) {
    next(error); // pass any error to the error handler middleware
  }
};

  public updateProfilePic = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.session.user.id;
  
      if (!userId || !req.file || !req.file.path) {
        return res.status(400).json({
          error: true,
          message: "Missing user ID or profile image",
        });
      }
  
      const profilePicUrl = req.file.path;
  
      const updatedUser = await this.service.updateProfilePic(
        userId,
        { profilePic: profilePicUrl }
      );
  
      return res.status(200).json({
        error: false,
        message: "Profile picture updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  };

  public requestPhoneNumberVerification = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
    const res = await this.service.requestPhoneNumberVerification({
      userId: request.session.user.id,
      ...request.body
    });
    response.status(StatusCodes.OK).send({
      error: false,
      message: 'OTP sent successfully',
      data: res
    });
  };

  public verifyPhoneNumber = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
    const res = await this.service.verifyPhoneNumber({
      userId: request.session.user.id,
      ...request.body
    });
    response.status(StatusCodes.OK).send({
      error: false,
      message: 'Phone number verified successfully',
      data: res
    });
  };

  public changePassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.session.user.id; 
      const changePasswordDto: ChangePasswordDto = req.body;

      await this.service.changePassword(userId, changePasswordDto);

      res.status(StatusCodes.OK).json({
        error: false,
        message: 'Password changed successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

   public getUserById = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const res = await this.service.getUserById(id)
    response.status(StatusCodes.OK).send({
      error: false,
      message: 'User fetched successful',
      data: res
    });
  };

  public getReporterInfo = async (req: AuthenticatedRequest, res: Response, next: NextFunction)=>{
    try {
      const id = req.params.id;
      const reporter = await this.service.getReporterInfo(id);
      res.status(200).json(reporter);
    } catch (error) {
      next(error);
    }
  }

}