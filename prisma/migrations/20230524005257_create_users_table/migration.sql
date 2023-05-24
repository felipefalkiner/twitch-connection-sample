-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "twitchID" TEXT NOT NULL,
    "twitchLogin" TEXT NOT NULL,
    "twitchProfileImg" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,
    "alertID" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_twitchID_key" ON "Users"("twitchID");
