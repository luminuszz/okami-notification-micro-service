-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "providers" TEXT[] DEFAULT ARRAY['all']::TEXT[],
ALTER COLUMN "channels" SET DEFAULT ARRAY[]::TEXT[];
