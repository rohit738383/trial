/*
  Warnings:

  - The primary key for the `Seminar` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Seminar" DROP CONSTRAINT "Seminar_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Seminar_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Seminar_id_seq";
