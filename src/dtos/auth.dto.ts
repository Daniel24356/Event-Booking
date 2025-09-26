import { IsNotEmpty, IsEmail, IsString } from "class-validator";
import { TransformToLowerCase, TrimSpaces } from "../validations";

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @TransformToLowerCase()
  @TrimSpaces()
  email: string;

  @IsString()
  @IsNotEmpty()
  @TransformToLowerCase()
  @TrimSpaces()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @TransformToLowerCase()
  @TrimSpaces()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @TransformToLowerCase()
  @TrimSpaces()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginDto {
  @TransformToLowerCase()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class EmailOtpDto {
  @TransformToLowerCase()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordDto {
  @TransformToLowerCase()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  otp: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class VerifyEmailDto {
  @TransformToLowerCase()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}