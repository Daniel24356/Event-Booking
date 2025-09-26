import { IsDateString, IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsString, IsUUID, Matches, MinLength } from "class-validator";
import { IsPhoneNumber } from "../validations";
import { Gender } from "@prisma/client";

export class UpdateProfileDto {

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;
  
  @IsEnum(Gender)
  @IsOptional()
  gender?: string;
   
  @IsString()
  @IsOptional()
  phoneNumber?: string;
   
  @IsString()
  @IsOptional()
  email?: string;
   
  @IsString()
  @IsOptional()
  state?: string;
   
  @IsString()
  @IsOptional()
  city?: string;
   
  @IsString()
  @IsOptional()
  address?: string;
   
  @IsString()
  @IsOptional()
  profilePhoto?: string;
  
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;
}

export class ChangePasswordDto {

  @IsString({ message: 'Current password must be a string' })
  @MinLength(6, { message: 'Current password must be at least 6 characters' })
  currentPassword: string;

  @IsString({ message: 'New password must be a string' })
  @MinLength(8, { message: 'New password must be at least 8 characters' })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/, {
    message: 'New password must include uppercase, lowercase, and a number',
  })
  newPassword: string;

  @IsString({ message: 'Security question is required' })
  securityQuestion: string;

  @IsString({ message: 'Security answer is required' })
  securityAnswer: string;

  @IsString({ message: 'Secondary security question is required' })
  securityQuestion2: string;

  @IsString({ message: 'Secondary security answer is required' })
  securityAnswer2: string;
}

export class RequestPhoneNumberVerificationDto {
  @IsUUID()
  userId: string;
  
  @IsPhoneNumber()
  phoneNumber: string;
}

export class VerifyPhoneNumberDto extends RequestPhoneNumberVerificationDto {
  @IsString()
  @IsNumberString()
  @IsNotEmpty()
  otp: string;
}