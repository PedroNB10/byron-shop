-- DropForeignKey
ALTER TABLE `produto` DROP FOREIGN KEY `produto_estoque_id_fkey`;

-- AddForeignKey
ALTER TABLE `produto` ADD CONSTRAINT `produto_estoque_id_fkey` FOREIGN KEY (`estoque_id`) REFERENCES `estoque`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
