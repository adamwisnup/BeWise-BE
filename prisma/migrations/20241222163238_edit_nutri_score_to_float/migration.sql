/*
  Warnings:

  - The `nutri_score` column on the `products` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "nutri_score",
ADD COLUMN     "nutri_score" DOUBLE PRECISION;
