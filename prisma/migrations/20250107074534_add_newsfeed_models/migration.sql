-- CreateTable
CREATE TABLE "Newsfeed" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "isPublished" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Newsfeed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsfeedImage" (
    "id" SERIAL NOT NULL,
    "newsfeedId" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsfeedImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NewsfeedImage" ADD CONSTRAINT "NewsfeedImage_newsfeedId_fkey" FOREIGN KEY ("newsfeedId") REFERENCES "Newsfeed"("id") ON DELETE CASCADE ON UPDATE CASCADE;
