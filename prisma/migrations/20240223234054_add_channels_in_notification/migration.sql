-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "channels" TEXT[] DEFAULT ARRAY['all']::TEXT[];
