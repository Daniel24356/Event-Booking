-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('User', 'Admin', 'SuperAdmin');

-- CreateEnum
CREATE TYPE "public"."AccountStatus" AS ENUM ('active', 'restricted');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "phoneNumber" TEXT,
    "phoneNumberVerified" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT NOT NULL,
    "state" TEXT,
    "city" TEXT,
    "address" TEXT,
    "profilePhoto" TEXT DEFAULT 'https://res.cloudinary.com/df6xz7bqp/image/upload/v1740443796/default_user_lppcww.jpg',
    "dateOfBirth" TIMESTAMP(3),
    "accountStatus" "public"."AccountStatus" NOT NULL DEFAULT 'active',
    "securityQuestionOne" TEXT,
    "securityQuestionTwo" TEXT,
    "securityAnswerOne" TEXT,
    "securityAnswerTwo" TEXT,
    "identityVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "adminNote" TEXT,
    "gender" "public"."Gender",
    "role" "public"."UserRole" DEFAULT 'User',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Booking" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
