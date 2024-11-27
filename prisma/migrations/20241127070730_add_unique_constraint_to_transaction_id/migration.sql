/*
  Warnings:

  - A unique constraint covering the columns `[transaction_id]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `status` on the `bookings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'ACTIVE', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "status",
ADD COLUMN     "status" "BookingStatus" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "payments_transaction_id_key" ON "payments"("transaction_id");
