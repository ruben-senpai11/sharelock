-- CreateTable
CREATE TABLE "InsuredProducts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "InsuredProducts_product_id_key" ON "InsuredProducts"("product_id");
