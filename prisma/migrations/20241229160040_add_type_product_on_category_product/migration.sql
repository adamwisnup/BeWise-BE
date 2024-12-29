/*
  Warnings:

  - Added the required column `type` to the `category_products` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('BEVERAGE', 'FOOD');

-- AlterTable
ALTER TABLE "category_products" ADD COLUMN     "type" "ProductType" NOT NULL;
