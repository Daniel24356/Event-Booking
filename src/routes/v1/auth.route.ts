import express from 'express';
import AuthController from '../../controllers/auth.controller';
import dtoValidationMiddleware from '../../middlewares/validation.middleware';
import { EmailOtpDto, LoginDto, RegisterDto, ResetPasswordDto, VerifyEmailDto } from '../../dtos/auth.dto';

const router = express.Router();
const controller = new AuthController();

router.post(
  '/register',
  dtoValidationMiddleware(RegisterDto, 'body'),
  controller.register
);

router.post(
  '/login',
  dtoValidationMiddleware(LoginDto, 'body'),
  controller.login
);

router.post(
  '/forgot-password',
  dtoValidationMiddleware(EmailOtpDto, 'body'),
  controller.forgotPassword
);

router.post(
  '/reset-password',
  dtoValidationMiddleware(ResetPasswordDto, 'body'),
  controller.resetPassword
);

router.post(
  '/request-email-verification',
  dtoValidationMiddleware(EmailOtpDto, 'body'),
  controller.requestEmailVerification
);

router.post(
  '/verify-email',
  dtoValidationMiddleware(VerifyEmailDto, 'body'),
  controller.verifyEmail
);

export default router;