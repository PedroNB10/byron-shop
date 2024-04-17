-- AddForeignKey
ALTER TABLE `carrinho` ADD CONSTRAINT `carrinho_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
