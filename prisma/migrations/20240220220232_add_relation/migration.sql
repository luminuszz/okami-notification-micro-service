/*
  Warnings:

  - You are about to drop the column `recipientId` on the `Notification` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[subscriberId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `subscriberId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_recipientId_fkey";

-- DropIndex
DROP INDEX "Notification_recipientId_key";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "recipientId",
ADD COLUMN     "subscriberId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Notification_subscriberId_key" ON "Notification"("subscriberId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "Subscriber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
