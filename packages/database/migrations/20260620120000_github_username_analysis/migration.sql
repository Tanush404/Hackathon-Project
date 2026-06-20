-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL,
ADD COLUMN     "githubId" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "followers" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "following" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "publicRepos" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "users_githubId_key" ON "users"("githubId");

-- AlterTable
ALTER TABLE "repositories" ALTER COLUMN "githubRepoId" DROP NOT NULL,
ADD COLUMN     "repositoryId" TEXT,
ADD COLUMN     "stars" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "forks" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "language" TEXT,
ADD COLUMN     "topics" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "repositories_repositoryId_key" ON "repositories"("repositoryId");
