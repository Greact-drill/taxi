-- AlterTable
ALTER TABLE "PassengerRecord" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deletedAt" TEXT,
ALTER COLUMN "token" DROP NOT NULL;
