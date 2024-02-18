/*
  Warnings:

  - You are about to drop the column `email` on the `Subscriber` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Subscriber_email_key";

-- AlterTable
ALTER TABLE "Subscriber" DROP COLUMN "email";
