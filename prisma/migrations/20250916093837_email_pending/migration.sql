/*
  Warnings:

  - A unique constraint covering the columns `[emailPending]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "emailPending" TEXT,
ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "image" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "User_emailPending_key" ON "public"."User"("emailPending");
