/*
  Warnings:

  - Added the required column `capacity` to the `Seminar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Seminar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Seminar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Seminar` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SeminarStatus" AS ENUM ('UPCOMING', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Seminar" ADD COLUMN     "capacity" INTEGER NOT NULL,
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "status" "SeminarStatus" NOT NULL DEFAULT 'UPCOMING',
ADD COLUMN     "time" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "seminarId" TEXT NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Booking_ticketId_key" ON "Booking"("ticketId");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_seminarId_fkey" FOREIGN KEY ("seminarId") REFERENCES "Seminar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
