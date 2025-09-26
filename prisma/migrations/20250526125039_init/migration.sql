-- CreateTable
CREATE TABLE "SeenItemReports" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "seenDate" TEXT NOT NULL,
    "seenLocation" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeenItemReports_pkey" PRIMARY KEY ("id")
);
