/*
  Warnings:

  - You are about to drop the column `areaOfInterest` on the `UserProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "areaOfInterest",
ADD COLUMN     "counterpartnerEducation" TEXT,
ADD COLUMN     "counterpartnerName" TEXT,
ADD COLUMN     "counterpartnerPhoneNumber" TEXT;
