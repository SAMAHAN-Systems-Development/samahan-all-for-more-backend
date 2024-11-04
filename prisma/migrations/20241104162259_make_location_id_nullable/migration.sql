-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_location_id_fkey";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "location_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
