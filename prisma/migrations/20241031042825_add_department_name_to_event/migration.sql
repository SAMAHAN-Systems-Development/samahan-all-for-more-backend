/*
  Warnings:

  - Added the required column `department_name` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "department_name" TEXT NOT NULL;
