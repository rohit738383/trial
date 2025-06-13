/*
  Warnings:

  - Added the required column `gender` to the `Child` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "Child" ADD COLUMN     "gender" "Gender" NOT NULL;
