/*
  Warnings:

  - You are about to drop the column `quantidade_disponivel` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the `_CarrinhoToProduto` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id]` on the table `produto` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[estoque_id]` on the table `produto` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `estoque_id` to the `produto` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_CarrinhoToProduto` DROP FOREIGN KEY `_CarrinhoToProduto_A_fkey`;

-- DropForeignKey
ALTER TABLE `_CarrinhoToProduto` DROP FOREIGN KEY `_CarrinhoToProduto_B_fkey`;

-- AlterTable
ALTER TABLE `produto` DROP COLUMN `quantidade_disponivel`,
    ADD COLUMN `estoque_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `_CarrinhoToProduto`;

-- CreateTable
CREATE TABLE `estoque` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quantidade_disponivel` INTEGER NOT NULL,
    `quantidade_pedida` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `estoque_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `item_carrinho` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quantidade` INTEGER NOT NULL,
    `produto_id` INTEGER NOT NULL,
    `carrinho_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `produto_id_key` ON `produto`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `produto_estoque_id_key` ON `produto`(`estoque_id`);

-- AddForeignKey
ALTER TABLE `produto` ADD CONSTRAINT `produto_estoque_id_fkey` FOREIGN KEY (`estoque_id`) REFERENCES `estoque`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item_carrinho` ADD CONSTRAINT `item_carrinho_carrinho_id_fkey` FOREIGN KEY (`carrinho_id`) REFERENCES `carrinho`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item_carrinho` ADD CONSTRAINT `item_carrinho_produto_id_fkey` FOREIGN KEY (`produto_id`) REFERENCES `produto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
