import _ from 'lodash';
import moment from 'moment';
import HttpException from '../utils/exception';
import { StatusCodes } from 'http-status-codes';
import UtilsService from './utils.service';
import { EmailOtpDto, LoginDto, RegisterDto, ResetPasswordDto, VerifyEmailDto } from '../dtos/auth.dto';
import config from '../config';
import redis from '../redis';
import { AccountStatus } from '@prisma/client';
import nodemailer from 'nodemailer'
import { EmailResponse, ForgotPassword, OtpEmail } from './EmailServices';
import React from 'react';
import EmailService2 from './EmailServices/EmailService2';

const emailService2 = new EmailService2();

export default class AuthService {
  private utils: UtilsService = new UtilsService();

  public async register(dto: RegisterDto) {
    const { firstName, lastName, username, email, password } = dto;
    const existingEmail = await this.utils.dbService.user.findFirst({
      where: {
        email
      }
    });
    if (existingEmail) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        'Email already in use'
      );
    };

    const existingUsername = await this.utils.dbService.user.findFirst({
      where: {
        username
      }
    })
    if (existingUsername) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        'Username already in use'
      );
    };

    const user = await this.utils.dbService.user.create({
      data: {
        firstName,
        lastName,
        email,
        username,
        password: await this.utils.bcryptHash(password)
      }
    });

    const code = config.app.isProduction ? _.random(10000, 99999).toString() : '12345';
    await redis.setex(`verification:email:${user.email}`, 30 * 60, code);

    const greeting = user.firstName 
  ? this.utils.capitalizeString(user.firstName)
  : 'User';

  const info =  await this.utils.emailService.sendEmail(
      user.email,
      'Verify your email',
      `<p>Hello, ${greeting}</p>
      <p>Here's your one time pin <h3>${code}</h3> </p>
      <p><strong>Note: </strong>This pin is only valid for <strong>30 minutes</strong></p>`
    );

    const template = <OtpEmail otp={code} />;
    const response: EmailResponse = await emailService2.sendEmail(user.email, "Verify your email", template);
    if(!response.success){
      throw new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, response.error || "Failed to send otp");
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

  public async login(dto: LoginDto) {
    const { email, password } = dto;
    const user = await this.utils.dbService.user.findFirst({
      where: {
        email
      }
    })
    if (!user) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        'Invalid login credentials'
      );
    }

    if (user.accountStatus === AccountStatus.restricted) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        'Account restricted please contact support'
      );
    }

    if (!user.emailVerified) {
      const code = config.app.isProduction ? _.random(10000, 99999).toString() : '12345';
      await redis.setex(`verification:email:${user.email}`, 30 * 60, code);
      
        const greeting = user.firstName 
  ? this.utils.capitalizeString(user.firstName)
  : 'User';

      await this.utils.emailService.sendEmail(
        user.email,
        'Verify your email',
        `<p>Hello, ${greeting}}</p>
        <p>Here's your one time pin <h3>${code}</h3> </p>
        <p><strong>Note: </strong>This pin is only valid for <strong>30 minutes</strong></p>`
      );

      const template = <OtpEmail otp={code} />;
      const response: EmailResponse = await emailService2.sendEmail(user.email, "Verify your email", template);
      if(!response.success){
        throw new HttpException(
          StatusCodes.INTERNAL_SERVER_ERROR, 
          "Email not verified, Failed to send verification email, Please try again later"
        );
      }
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        'Email not verified, Please check your inbox for the verification email'
      );
    }

    if (!user.password) {
  throw new Error('Password is missing');
}

    const passwordsMatch = await this.utils.bcryptCompare(password, user.password);

    if (!passwordsMatch) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        'Invalid login credentials'
      );
    }

    const token = await this.createSession(user.id);

    return {
      user: _.omit(user,
      [
        'password',
        'securityQuestionOne',
        'securityQuestionTwo',
        'securityAnswerOne',
        'securityAnswerTwo'
      ]),
      token,
    };
  }

  public async forgotPassword(dto: EmailOtpDto) {
    const { email } = dto;
    const user = await this.utils.dbService.user.findFirst({
      where: {
        email,
      }
    });
    if (!user) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        'User not found'
      );
    }

    const code = config.app.isProduction ? _.random(10000, 99999).toString() : '12345';
    await redis.setex(`passwordReset:userId:${user.id}`, 30 * 60, code);

      const greeting = user.firstName 
  ? this.utils.capitalizeString(user.firstName)
  : 'User';

    await this.utils.emailService.sendEmail(
      user.email,
      'Forgot Password',
      `<p>Hello, ${greeting}</p>
      <p>You just requested to change your password, if this action was not performed by you, please ignore this email.</p>
      <p>Here's your one time pin <h3>${code}</h3> </p>
      <p><strong>Note: </strong>This pin is only valid for <strong>30 minutes</strong></p>`
    );
  }

  public async resetPassword(dto: ResetPasswordDto) {
    const { email, otp, password } = dto;
    const user = await this.utils.dbService.user.findFirst({
      where: {
        email,
      }
    });
    if (!user) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        'User not found'
      );
    }

    const storedCode = await redis.get(`passwordReset:userId:${user.id}`);
    if (!storedCode) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        'Invalid OTP provided'
      );
    }

    if (otp !== storedCode) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        'Invalid OTP provided'
      );
    }

    await this.utils.dbService.user.update({
      where: {
        id: user.id
      },
      data: {
        password: await this.utils.bcryptHash(password)
      }
    });

    await redis.del(`passwordReset:userId:${user.id}`);
  }

  public async requestEmailVerification(dto: EmailOtpDto) {
    const { email } = dto;
    const user = await this.utils.dbService.user.findFirst({
      where: {
        email,
      }
    });
    if (!user) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        'User not found'
      );
    }

    if (user.emailVerified) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        'Email already verified'
      );
    }

    const code = config.app.isProduction ? _.random(10000, 99999).toString() : '12345';
    await redis.setex(`verification:email:${user.email}`, 30 * 60, code);

    // await this.utils.emailService.sendEmail(
    //   user.email,
    //   'Verify your email',
    //   `<p>Hello, ${this.utils.capitalizeString(user.firstName)}</p>
    //   <p>Here's your one time pin <h3>${code}</h3> </p>
    //   <p><strong>Note: </strong>This pin is only valid for <strong>30 minutes</strong></p>`
    // );
  }

  public async verifyEmail(dto: VerifyEmailDto) {
    const { email, otp } = dto;
    const user = await this.utils.dbService.user.findFirst({
      where: {
        email,
      }
    });
    if (!user) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        'User not found'
      );
    }

    const storedCode = await redis.get(`verification:email:${user.email}`);
    if (!storedCode) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        'Invalid OTP provided'
      );
    }

    if (otp !== storedCode) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        'Invalid OTP provided'
      );
    }

    await this.utils.dbService.user.update({
      where: {
        id: user.id
      },
      data: {
        emailVerified: true
      }
    });

    await redis.del(`verification:email:${user.email}`);
  }

  private async createSession(userId: string) {
    const token = this.utils.generateJwtToken({ userId, flag: 'AUTH' });
    const decodedToken = await this.utils.decodeJwtToken(token);
    const sessionKeyPrefix = `sessions:${userId}`;
    const sessionKey = `${sessionKeyPrefix}:${decodedToken.counter as string}`;
    const expires = moment().diff(moment(decodedToken.exp), 'seconds');
    await redis.setex(sessionKey, expires, token);
    await redis.sadd(sessionKeyPrefix, sessionKey);
    await redis.expire(sessionKeyPrefix, expires);
    return token;
  }
}
