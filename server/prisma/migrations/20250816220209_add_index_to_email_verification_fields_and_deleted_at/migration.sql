-- CreateIndex
CREATE INDEX "Movie_isDeleted_idx" ON "public"."Movie"("isDeleted");

-- CreateIndex
CREATE INDEX "Thread_isDeleted_idx" ON "public"."Thread"("isDeleted");

-- CreateIndex
CREATE INDEX "User_userId_idx" ON "public"."User"("userId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_isDeleted_idx" ON "public"."User"("isDeleted");

-- CreateIndex
CREATE INDEX "User_isEmailVerified_idx" ON "public"."User"("isEmailVerified");

-- CreateIndex
CREATE INDEX "User_emailVerificationToken_idx" ON "public"."User"("emailVerificationToken");
