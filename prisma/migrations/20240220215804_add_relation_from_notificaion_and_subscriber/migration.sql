-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "Subscriber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
