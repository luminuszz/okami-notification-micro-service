/*
  Warnings:

  - A unique constraint covering the columns `[recipientId]` on the table `Subscriber` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `recipientId` to the `Subscriber` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscriber" ADD COLUMN     "recipientId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_recipientId_key" ON "Subscriber"("recipientId");
