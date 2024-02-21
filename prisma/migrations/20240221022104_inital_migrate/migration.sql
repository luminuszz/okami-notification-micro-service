-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscriber" (
    "id" TEXT NOT NULL,
    "telegramId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recipientId" TEXT NOT NULL,

    CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "_ChannelToSubscriber" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_telegramId_key" ON "Subscriber"("telegramId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_recipientId_key" ON "Subscriber"("recipientId");

-- CreateIndex
CREATE UNIQUE INDEX "MobileSubscription_subscriptionToken_key" ON "MobileSubscription"("subscriptionToken");

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelToSubscriber_AB_unique" ON "_ChannelToSubscriber"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelToSubscriber_B_index" ON "_ChannelToSubscriber"("B");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "Subscriber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebPushSubscription" ADD CONSTRAINT "WebPushSubscription_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "Subscriber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MobileSubscription" ADD CONSTRAINT "MobileSubscription_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "Subscriber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToSubscriber" ADD CONSTRAINT "_ChannelToSubscriber_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToSubscriber" ADD CONSTRAINT "_ChannelToSubscriber_B_fkey" FOREIGN KEY ("B") REFERENCES "Subscriber"("id") ON DELETE CASCADE ON UPDATE CASCADE;
