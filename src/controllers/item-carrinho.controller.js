import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getItemCarrinho = async (carrinhoId, produtoId) => {
  const itemCarrinho = await prisma.itemCarrinho.findFirst({
    where: { carrinhoId: carrinhoId, produtoId: produtoId },
  });

  return itemCarrinho;
};

export const criarInstanciaItemCarrinho = async (
  carrinhoId,
  produtoId,
  quantidade
) => {
  await prisma.itemCarrinho.create({
    data: {
      carrinhoId: carrinhoId,
      produtoId: produtoId,
      quantidade: quantidade,
    },
  });
};

export const deletarInstanciaItemCarrinho = async (itemCarrinho) => {
  await prisma.itemCarrinho.delete({
    where: { id: itemCarrinho.id },
  });
};

export const adicionarItemCarrinho = async (itemCarrinho) => {
  await prisma.itemCarrinho.update({
    where: { id: itemCarrinho.id },
    data: {
      quantidade: itemCarrinho.quantidade + 1,
    },
  });
};

export const removerItemCarrinho = async (itemCarrinho) => {
  await prisma.itemCarrinho.update({
    where: { id: itemCarrinho.id },
    data: {
      quantidade: itemCarrinho.quantidade - 1,
    },
  });
};
