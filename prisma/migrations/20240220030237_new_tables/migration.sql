/*
  Warnings:

  - You are about to drop the column `mobilePushToken` on the `Subscriber` table. All the data in the column will be lost.
  - You are about to drop the column `webPushSubscriptionAuth` on the `Subscriber` table. All the data in the column will be lost.
  - You are about to drop the column `webPushSubscriptionP256dh` on the `Subscriber` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Subscriber" DROP COLUMN "mobilePushToken",
DROP COLUMN "webPushSubscriptionAuth",
DROP COLUMN "webPushSubscriptionP256dh";

-- CreateTable
CREATE TABLE "WebPushSubscription" (
    "id" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subscriberId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,

    CONSTRAINT "WebPushSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MobileSubscription" (
    "id" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,
    "subscriptionToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MobileSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MobileSubscription_subscriptionToken_key" ON "MobileSubscription"("subscriptionToken");

-- AddForeignKey
ALTER TABLE "WebPushSubscription" ADD CONSTRAINT "WebPushSubscription_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "Subscriber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MobileSubscription" ADD CONSTRAINT "MobileSubscription_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "Subscriber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
