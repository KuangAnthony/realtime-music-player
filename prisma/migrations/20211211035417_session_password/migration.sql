/*
  Warnings:

  - Added the required column `password` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "password" TEXT NOT NULL,
ALTER COLUMN "current_song" DROP NOT NULL;
