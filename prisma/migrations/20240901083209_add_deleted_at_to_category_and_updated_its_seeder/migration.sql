-- DropForeignKey
ALTER TABLE "PDFAttachment" DROP CONSTRAINT "PDFAttachment_bulletin_id_fkey";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "PDFAttachment" ADD CONSTRAINT "PDFAttachment_bulletin_id_fkey" FOREIGN KEY ("bulletin_id") REFERENCES "Bulletin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
