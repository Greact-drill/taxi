-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM (
  'awaiting_driver',
  'driver_assigned',
  'driver_arrived',
  'on_trip',
  'completed',
  'cancelled'
);

-- CreateEnum
CREATE TYPE "ChatAuthorRole" AS ENUM (
  'passenger',
  'driver',
  'dispatcher'
);

-- CreateTable
CREATE TABLE "passengers" (
  "id" SERIAL NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "token" TEXT NOT NULL,

  CONSTRAINT "passengers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drivers" (
  "id" SERIAL NOT NULL,
  "name" TEXT NOT NULL,
  "car" TEXT NOT NULL,
  "login" TEXT NOT NULL,
  "hash" TEXT NOT NULL,
  "token" TEXT NOT NULL,

  CONSTRAINT "drivers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
  "id" SERIAL NOT NULL,
  "passenger_id" INTEGER NOT NULL,
  "from_address" TEXT NOT NULL,
  "to_address" TEXT NOT NULL,
  "driver_id" INTEGER,
  "status" "OrderStatus" NOT NULL,
  "cancel_reason" TEXT,
  "deleted" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMPTZ NOT NULL,
  "assigned_at" TIMESTAMPTZ,
  "completed_at" TIMESTAMPTZ,
  "deleted_at" TIMESTAMPTZ,

  CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_chat_messages" (
  "id" SERIAL NOT NULL,
  "order_id" INTEGER NOT NULL,
  "author_role" "ChatAuthorRole" NOT NULL,
  "text" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL,

  CONSTRAINT "order_chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "passengers_token_key" ON "passengers"("token");

-- CreateIndex
CREATE UNIQUE INDEX "drivers_login_key" ON "drivers"("login");

-- CreateIndex
CREATE UNIQUE INDEX "drivers_token_key" ON "drivers"("token");

-- CreateIndex
CREATE INDEX "orders_passenger_id_idx" ON "orders"("passenger_id");

-- CreateIndex
CREATE INDEX "orders_driver_id_idx" ON "orders"("driver_id");

-- CreateIndex
CREATE INDEX "orders_status_deleted_idx" ON "orders"("status", "deleted");

-- CreateIndex
CREATE INDEX "order_chat_messages_order_id_idx" ON "order_chat_messages"("order_id");

-- AddForeignKey
ALTER TABLE "orders"
ADD CONSTRAINT "orders_passenger_id_fkey"
FOREIGN KEY ("passenger_id")
REFERENCES "passengers"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders"
ADD CONSTRAINT "orders_driver_id_fkey"
FOREIGN KEY ("driver_id")
REFERENCES "drivers"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_chat_messages"
ADD CONSTRAINT "order_chat_messages_order_id_fkey"
FOREIGN KEY ("order_id")
REFERENCES "orders"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
