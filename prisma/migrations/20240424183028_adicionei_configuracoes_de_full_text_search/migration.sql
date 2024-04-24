-- CreateIndex
CREATE FULLTEXT INDEX `produto_nome_descricao_categoria_idx` ON `produto`(`nome`, `descricao`, `categoria`);
