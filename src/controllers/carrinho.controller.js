import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import * as produtosController from "./produtos.controller.js";
import * as usuarioController from "./usuario.controller.js";
import * as estoqueController from "./estoques.controller.js";

export const removerProdutoDoCarrinho = async (req, res) => {
  const data = req.params;
  console.log(data);
  console.log("remover produto do carrinho");

  let { produtoId, usuarioId } = data;

  produtoId = parseInt(produtoId);
  usuarioId = parseInt(usuarioId);

  console.log(produtoId);
  console.log(usuarioId);

  const usuario = await usuarioController.getUsuarioPorId(usuarioId);

  if (!usuario) {
    res.status(404).json({
      msg: "Usuário não encontrado",
    });
    return;
  }

  const produto = await produtosController.getProdutoPorId(produtoId);

  if (!produto) {
    res.status(404).json({
      msg: "Produto não encontrado",
    });
    return;
  }

  const carrinho = await prisma.carrinho.findFirst({
    where: { statusAberto: true, usuarioId: usuarioId },
    include: {
      itensCarrinho: true,
    },
  });

  if (!carrinho) {
    res.status(404).json({
      msg: "Carrinho não encontrado",
    });
    return;
  }
  console.log("carrinho aberto:");
  console.log(carrinho.itensCarrinho);

  const estoque = await estoqueController.getEstoquePorProdutoId(produtoId);

  const itemCarrinho = await prisma.itemCarrinho.findFirst({
    where: { carrinhoId: carrinho.id, produtoId: produtoId },
  });

  if (!itemCarrinho) {
    res.status(404).json({
      msg: "Produto não encontrado no carrinho",
    });
    return;
  }

  if (itemCarrinho.quantidade === 0) {
    res.status(404).json({
      msg: "Produto não encontrado no carrinho",
    });
    return;
  }

  if (itemCarrinho.quantidade === 1) {
    await prisma.itemCarrinho.delete({
      where: { id: itemCarrinho.id },
    });

    await estoqueController.adicionarItemEstoque(estoque, produtoId);

    res.json({
      data: "carrinho",
      msg: "Produto removido do carrinho com sucesso",
    });
    return;
  } else {
    await prisma.itemCarrinho.update({
      where: { id: itemCarrinho.id },
      data: {
        quantidade: itemCarrinho.quantidade - 1,
      },
    });

    await estoqueController.adicionarItemEstoque(estoque, produtoId);

    res.json({
      data: "carrinho",
      msg: "Produto removido do carrinho com sucesso",
    });
    return;
  }
};

export const adicionarProdutoAoCarrinho = async (req, res) => {
  const data = req.body.data;
  console.log(data);

  const { produtoId, usuarioId } = data;

  const usuario = await usuarioController.getUsuarioPorId(usuarioId);

  if (!usuario) {
    res.status(404).json({
      msg: "Usuário não encontrado",
    });
    return;
  }

  const produto = await produtosController.getProdutoPorId(produtoId);

  if (!produto) {
    res.status(404).json({
      msg: "Produto não encontrado",
    });
    return;
  }

  console.log(usuario);
  console.log("items no carrinho");

  const estoque = await estoqueController.getEstoquePorProdutoId(produtoId);

  if (estoque.quantidadeDisponivel === 0) {
    res.status(400).json({
      msg: "Quantidade insuficiente em estoque",
    });
    return;
  }

  if (usuario.carrinhos.length === 0) {
    // criação do primeiro carrinho
    await prisma.carrinho.create({
      data: {
        statusAberto: true,
        usuarioId: usuarioId,
        itensCarrinho: {
          create: {
            produtoId: produtoId,
            quantidade: 1,
          },
        },
      },
    });

    if (estoque.quantidadeDisponivel === 0) {
      res.status(400).json({
        msg: "Quantidade insuficiente em estoque",
      });
      return;
    }

    await estoqueController.removerItemEstoque(estoque, produtoId);

    console.log("carrinho criado com itemCarrinho AAAAAAAa");

    res.json({
      data: "carrinho",
      msg: "Produto adicionado ao carrinho com sucesso",
    });
    return;
  } else {
    const carrinho = await prisma.carrinho.findFirst({
      where: { statusAberto: true, usuarioId: usuarioId },
    });
    console.log("carrinho aberto:");
    console.log(carrinho);

    //procurando o item correspondente ao produto no carrinho
    const itemCarrinho = await prisma.itemCarrinho.findFirst({
      where: { carrinhoId: carrinho.id, produtoId: produtoId },
    });

    if (itemCarrinho) {
      if (estoque.quantidadeDisponivel > 0) {
        await prisma.itemCarrinho.update({
          where: { id: itemCarrinho.id },
          data: {
            quantidade: itemCarrinho.quantidade + 1,
          },
        });

        await estoqueController.removerItemEstoque(estoque, produtoId);
      } else {
        res.status(400).json({
          msg: "Quantidade insuficiente em estoque",
        });
        return;
      }
    } else {
      if (estoque.quantidadeDisponivel === 0) {
        res.status(400).json({
          msg: "Quantidade insuficiente em estoque",
        });
        return;
      }
      // arrumar a quantidade aqui
      await prisma.itemCarrinho.create({
        data: {
          carrinhoId: carrinho.id,
          produtoId: produtoId,
          quantidade: 1,
        },
      });

      await estoqueController.removerItemEstoque(estoque, produtoId);
    }
  }

  res.json({
    data: "itemCarrinho",
    msg: "Produto adicionado ao carrinho com sucesso",
  });
};
