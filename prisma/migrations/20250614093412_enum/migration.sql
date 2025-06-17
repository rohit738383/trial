/*
  Warnings:

  - The values [CANCELLED] on the enum `SeminarStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SeminarStatus_new" AS ENUM ('ONGOING', 'UPCOMING', 'COMPLETED');
ALTER TABLE "Seminar" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Seminar" ALTER COLUMN "status" TYPE "SeminarStatus_new" USING ("status"::text::"SeminarStatus_new");
ALTER TYPE "SeminarStatus" RENAME TO "SeminarStatus_old";
ALTER TYPE "SeminarStatus_new" RENAME TO "SeminarStatus";
DROP TYPE "SeminarStatus_old";
ALTER TABLE "Seminar" ALTER COLUMN "status" SET DEFAULT 'UPCOMING';
COMMIT;
