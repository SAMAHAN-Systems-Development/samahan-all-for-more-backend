-- AlterTable
ALTER TABLE "Bulletin" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "PDFAttachment" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Poster" ADD COLUMN     "deleted_at" TIMESTAMP(3);
