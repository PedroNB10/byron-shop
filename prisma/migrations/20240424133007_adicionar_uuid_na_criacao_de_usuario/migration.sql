/*
  Warnings:

  - The primary key for the `usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `carrinho` DROP FOREIGN KEY `carrinho_usuario_id_fkey`;

-- AlterTable
ALTER TABLE `carrinho` MODIFY `usuario_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `usuario` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `carrinho` ADD CONSTRAINT `carrinho_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
