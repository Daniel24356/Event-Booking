import express from 'express';
import UserController from '../../controllers/user.controller';
import authMiddleware from '../../middlewares/auth.middleware';
import dtoValidationMiddleware from '../../middlewares/validation.middleware';
import { ChangePasswordDto, RequestPhoneNumberVerificationDto, UpdateProfileDto, VerifyPhoneNumberDto } from '../../dtos/user.dto';
import { uploadToCloudinaryProfileImage } from '../../cloudinary';

const router = express.Router();
const controller = new UserController();

router.get(
  '/',
  authMiddleware,
  controller.getProfile
);

router.put(
  '/update',
  authMiddleware,
  dtoValidationMiddleware(UpdateProfileDto, 'body'),
  controller.updateProfile
);

router.put(
  '/updateUser/:id',
  authMiddleware,
  dtoValidationMiddleware(UpdateProfileDto, 'body'),
  controller.updateUserById
);

router.put(
  '/updateProfilePic',
  authMiddleware,
  uploadToCloudinaryProfileImage,
  controller.updateProfilePic
);

router.post(
  '/request-phone-number-verification',
  authMiddleware,
  dtoValidationMiddleware(RequestPhoneNumberVerificationDto, 'body'),
  controller.requestPhoneNumberVerification
);

router.post(
  '/verify-phone-number',
  authMiddleware,
  dtoValidationMiddleware(VerifyPhoneNumberDto, 'body'),
  controller.verifyPhoneNumber
);

router.put(
  '/change-password',
  authMiddleware,
  dtoValidationMiddleware(ChangePasswordDto, 'body'),
  controller.changePassword
);

router.get(
  '/user/:id',
  authMiddleware,
  controller.getUserById
);

router.get(
  '/get-reporter/:id',
  authMiddleware,
  controller.getReporterInfo
);



export default router;