/*
  Warnings:

  - Made the column `image` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "image" SET NOT NULL,
ALTER COLUMN "image" SET DEFAULT 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBLjPO-2--UeYzGEvQJf4OFiEqBKfZt-RxMw&s';
