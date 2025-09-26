import { NextFunction, Request, Response } from 'express';
import AuthService from '../services/auth.service';
import { StatusCodes } from 'http-status-codes';

export default class AuthController {
  private readonly service: AuthService = new AuthService();

  public register = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const res = await this.service.register(request.body);
      response.status(StatusCodes.OK).send({
        error: false,
        message: 'Registration successful',
        data: res
      })
    } catch (error) {
      next(error);
    }
  };

  public login = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const res = await this.service.login(request.body);
      response.status(StatusCodes.OK).send({
        error: false,
        message: 'Login successful',
        data: res
      })
    } catch (error) {
      next(error);
    }
  };

  public forgotPassword = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const res = await this.service.forgotPassword(request.body);
      response.status(StatusCodes.OK).send({
        error: false,
        message: 'Password reset OTP sent successfully',
        data: res
      })
    } catch (error) {
      next(error);
    }
  };

  public resetPassword = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const res = await this.service.resetPassword(request.body);
      response.status(StatusCodes.OK).send({
        error: false,
        message: 'Password reset successful',
        data: res
      })
    } catch (error) {
      next(error);
    }
  };

  public requestEmailVerification = async (request: Request, response: Response, next: NextFunction) => {
    const res = await this.service.requestEmailVerification(request.body);
    response.status(StatusCodes.OK).send({
      error: false,
      message: 'OTP sent successful',
      data: res
    })
  };

  public verifyEmail = async (request: Request, response: Response, next: NextFunction) => {
    const res = await this.service.verifyEmail(request.body);
    response.status(StatusCodes.OK).send({
      error: false,
      message: 'Email verified successfully',
      data: res
    })
  };
}