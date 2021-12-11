-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "owner" TEXT NOT NULL,
    "joined_users" TEXT[],
    "current_song" TEXT NOT NULL,
    "queue" TEXT[],
    "isPlaying" BOOLEAN NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "from" TEXT NOT NULL,
    "session" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "version" BIGINT NOT NULL,
    "order" BIGINT NOT NULL
);

-- CreateTable
CREATE TABLE "ReplicacheClient" (
    "id" TEXT NOT NULL,
    "last_mutation_id" BIGINT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Message_id_key" ON "Message"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ReplicacheClient_id_key" ON "ReplicacheClient"("id");

CREATE SEQUENCE IF NOT EXISTS "version"