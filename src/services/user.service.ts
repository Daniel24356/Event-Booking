import _ from "lodash";
import UtilsService from "./utils.service";
import HttpException from '../utils/exception';
import { StatusCodes } from 'http-status-codes';
import { ChangePasswordDto, RequestPhoneNumberVerificationDto, UpdateProfileDto, VerifyPhoneNumberDto } from "../dtos/user.dto";
import config from "../config";
import redis from "../redis";
import termii from "../utils/termii";
import { compare, hash } from "bcryptjs";
import { Gender } from "@prisma/client";


export default class UserService {
  private utils: UtilsService = new UtilsService()

  public async getProfile(id: string) {
    const user = await this.utils.dbService.user.findFirst({
      where: {
        id
      }
    });

    if (!user) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        'User not found'
      );
    }

    return {
      ..._.omit(user,
        [
          'password',
          'securityQuestionOne',
          'securityQuestionTwo',
          'securityAnswerOne',
          'securityAnswerTwo'
        ])
    };
  }

public async updateProfile(userId: string, dto: UpdateProfileDto) {
  const existingUser = await this.utils.dbService.user.findFirst({
    where: { id: userId }
  });

  if (!existingUser) {
    throw new HttpException(
      StatusCodes.BAD_REQUEST,
      'User not found'
    );
  }

  const genderEnum = dto.gender
    ? (Object.values(Gender).includes(dto.gender as Gender) ? dto.gender as Gender : undefined)
    : existingUser.gender;

  const updateData = {
    ..._.omit(dto, ['userId', 'gender', 'dateOfBirth']),
    gender: genderEnum,
    dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : existingUser.dateOfBirth,
  };

  const user = await this.utils.dbService.user.update({
    where: { id: userId },
    data: updateData
  });

  return _.omit(user, [
    'password',
    'securityQuestionOne',
    'securityAnswerOne',
    'securityQuestionTwo',
    'securityAnswerTwo'
  ]);
}


  public async updateProfilePic(
    id: string,
    data: { profilePic: string }
  ): Promise<object> {
    if (!id || typeof id !== "string") {
      throw new HttpException(StatusCodes.BAD_REQUEST, "Invalid ID provided.");
    }

    const user = await this.utils.dbService.user.findFirst({
      where: { id },
    });

    if (!user) {
      throw new HttpException(StatusCodes.NOT_FOUND, "User not found");
    }

    const updatedUser = await this.utils.dbService.user.update({
      where: { id },
      data: { profilePhoto: data.profilePic },
    });

    // Omit sensitive fields
    return {
      ..._.omit(updatedUser, [
        "password",
        "securityQuestionOne",
        "securityQuestionTwo",
        "securityAnswerOne",
        "securityAnswerTwo",
      ]),
    };
  }


  public async requestPhoneNumberVerification(dto: RequestPhoneNumberVerificationDto) {
    const user = await this.utils.dbService.user.findFirst({
      where: {
        id: dto.userId
      }
    });

    if (!user) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        'User not found'
      );
    }

    const code = config.app.isProduction ? _.random(10000, 99999).toString() : '12345';
    await redis.setex(`verification:phoneNumber:${dto.phoneNumber}`, 30 * 60, code);
    const message = `Your Safeguard confirmation code is ${code}. It expires in 30 minutes.`;
    await termii(message, dto.phoneNumber);
  }

  public async verifyPhoneNumber(dto: VerifyPhoneNumberDto) {
    const user = await this.utils.dbService.user.findFirst({
      where: {
        id: dto.userId
      }
    });

    if (!user) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        'User not found'
      );
    }

    const storedCode = await redis.get(`verification:phoneNumber:${dto.phoneNumber}`);
    if (!storedCode) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        'Invalid phone number or verification code'
      );
    }

    if (dto.otp !== storedCode) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        'Invalid phone number or verification code'
      );
    }

    await this.utils.dbService.user.update({
      where: {
        id: dto.userId
      },
      data: {
        phoneNumber: dto.phoneNumber,
        phoneNumberVerified: true,
      }
    });
  }

  public async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    const { currentPassword, newPassword, securityQuestion, securityAnswer, securityQuestion2, securityAnswer2 } = changePasswordDto;

    const user = await this.findById(userId);
    if (!user) {
      throw new HttpException(StatusCodes.NOT_FOUND,'User not found');
    }

      if (!user.password) {
  throw new Error('Password is missing');
}

    const isCurrentPasswordValid = await compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new HttpException(StatusCodes.BAD_REQUEST,'Current password is incorrect');
    }

    if (!securityQuestion || !securityAnswer || !securityQuestion2 || !securityAnswer2) {
      throw new HttpException( StatusCodes.BAD_REQUEST,'Security questions and answers must be provided');
    }

    const isSecurityAnswerCorrect = securityAnswer.trim() && securityAnswer2.trim();
    if (!isSecurityAnswerCorrect) {
      throw new HttpException(StatusCodes.BAD_REQUEST,'Security answer(s) incorrect');
    }

    const hashedNewPassword = await hash(newPassword, 10); 

    await this.updatePassword(userId, hashedNewPassword);

    return;
  }

  public async findById(userId: string) {
    return this.utils.dbService.user.findUnique({ where: { id: userId } });
  }

  public async updatePassword(userId: string, newPassword: string) {
    return this.utils.dbService.user.update({
      where: { id: userId },
      data: { password: newPassword },
    });
  }

  public async getUserById (id: string){
    const user = await this.utils.dbService.user.findFirst({
      where: {
        id
      }
    });

    if (!user) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        'User not found'
      );
    }

    return {
      ..._.omit(user,
        [
          'password',
          'securityQuestionOne',
          'securityQuestionTwo',
          'securityAnswerOne',
          'securityAnswerTwo'
        ])
    };
  }




}
