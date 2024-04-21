import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getEstoquePorProdutoId = async (produtoId) => {
  const estoque = await prisma.estoque.findUnique({
    where: { id: produtoId },
  });

  return estoque;
};

export const adicionarItemEstoque = async (estoque, produtoId) => {
  await prisma.estoque.update({
    where: { id: produtoId },
    data: {
      quantidadeDisponivel: estoque.quantidadeDisponivel + 1,
    },
  });
};

export const removerItemEstoque = async (estoque, produtoId) => {
  await prisma.estoque.update({
    where: { id: produtoId },
    data: {
      quantidadeDisponivel: estoque.quantidadeDisponivel - 1,
    },
  });
};
