-- CreateTable
CREATE TABLE `usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(100) NOT NULL,
    `senha` VARCHAR(100) NOT NULL,
    `nome` VARCHAR(70) NOT NULL,
    `cpf` VARCHAR(11) NOT NULL,

    UNIQUE INDEX `usuario_email_key`(`email`),
    UNIQUE INDEX `usuario_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `descricao` VARCHAR(4000) NOT NULL,
    `preco` DECIMAL(10, 2) NOT NULL,
    `categoria` VARCHAR(50) NOT NULL,
    `quantidade_disponivel` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `foto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(2048) NOT NULL,
    `produtoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `carrinho` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fechado_em` DATETIME(3) NOT NULL,
    `status_aberto` BOOLEAN NOT NULL,
    `usuario_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CarrinhoToProduto` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CarrinhoToProduto_AB_unique`(`A`, `B`),
    INDEX `_CarrinhoToProduto_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `foto` ADD CONSTRAINT `foto_produtoId_fkey` FOREIGN KEY (`produtoId`) REFERENCES `produto`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CarrinhoToProduto` ADD CONSTRAINT `_CarrinhoToProduto_A_fkey` FOREIGN KEY (`A`) REFERENCES `carrinho`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CarrinhoToProduto` ADD CONSTRAINT `_CarrinhoToProduto_B_fkey` FOREIGN KEY (`B`) REFERENCES `produto`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
