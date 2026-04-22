-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('awaiting_driver', 'driver_assigned', 'driver_arrived', 'on_trip', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "ChatAuthorRole" AS ENUM ('passenger', 'driver', 'dispatcher');

-- CreateTable
CREATE TABLE "PassengerRecord" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "PassengerRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DriverRecord" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "car" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TEXT,

    CONSTRAINT "DriverRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderRecord" (
    "id" SERIAL NOT NULL,
    "passengerId" INTEGER NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "driverId" INTEGER,
    "status" "OrderStatus" NOT NULL,
    "cancelReason" TEXT,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TEXT NOT NULL,
    "assignedAt" TEXT,
    "completedAt" TEXT,
    "deletedAt" TEXT,

    CONSTRAINT "OrderRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderChatMessageRecord" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "authorRole" "ChatAuthorRole" NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,

    CONSTRAINT "OrderChatMessageRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PassengerRecord_token_key" ON "PassengerRecord"("token");

-- CreateIndex
CREATE UNIQUE INDEX "DriverRecord_login_key" ON "DriverRecord"("login");

-- CreateIndex
CREATE UNIQUE INDEX "DriverRecord_token_key" ON "DriverRecord"("token");

-- CreateIndex
CREATE INDEX "OrderRecord_passengerId_idx" ON "OrderRecord"("passengerId");

-- CreateIndex
CREATE INDEX "OrderRecord_driverId_idx" ON "OrderRecord"("driverId");

-- CreateIndex
CREATE INDEX "OrderRecord_status_deleted_idx" ON "OrderRecord"("status", "deleted");

-- CreateIndex
CREATE INDEX "OrderChatMessageRecord_orderId_createdAt_idx" ON "OrderChatMessageRecord"("orderId", "createdAt");

-- AddForeignKey
ALTER TABLE "OrderRecord" ADD CONSTRAINT "OrderRecord_passengerId_fkey" FOREIGN KEY ("passengerId") REFERENCES "PassengerRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderRecord" ADD CONSTRAINT "OrderRecord_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "DriverRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderChatMessageRecord" ADD CONSTRAINT "OrderChatMessageRecord_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "OrderRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
