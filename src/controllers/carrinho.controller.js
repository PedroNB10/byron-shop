import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import * as produtosController from "./produtos.controller.js";
import * as usuarioController from "./usuario.controller.js";
import * as estoqueController from "./estoques.controller.js";
import * as itemCarrinhoController from "./item-carrinho.controller.js";

import { jwtDecode } from "jwt-decode";

export const getCarrinho = async (req, res) => {};

export const removerProdutoDoCarrinho = async (req, res) => {
  let { produtoId } = req.params;

  produtoId = parseInt(produtoId);

  const token = req.headers.authorization.split(" ")[1];
  const usuarioId = jwtDecode(token).id;

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
      msg: "Não há carrinho aberto para este usuário, é preciso adicionar produtos ao carrinho antes de removê-los",
    });
    return;
  }

  const estoque = await estoqueController.getEstoquePorProdutoId(produtoId);

  const itemCarrinho = await itemCarrinhoController.getItemCarrinho(
    carrinho.id,
    produtoId
  );

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
    await itemCarrinhoController.deletarInstanciaItemCarrinho(itemCarrinho);

    await estoqueController.adicionarItemEstoque(estoque, produtoId);

    res.status(200).json({
      msg: "Produto removido do carrinho com sucesso",
    });
    return;
  } else {
    await itemCarrinhoController.removerItemCarrinho(itemCarrinho);

    await estoqueController.adicionarItemEstoque(estoque, produtoId);

    res.status(200).json({
      msg: "Produto removido do carrinho com sucesso",
    });
    return;
  }
};

export const adicionarProdutoAoCarrinho = async (req, res) => {
  console.log("adicionarProdutoAoCarrinho");
  const produtoId = parseInt(req.params.produtoId);
  console.log(produtoId);
  if (!produtoId) {
    res.status(400).json({
      msg: "Parâmetros inválidos, id do produto não encontrado",
    });
    return;
  }

  const token = req.headers.authorization.split(" ")[1];
  const usuarioId = jwtDecode(token).id;

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

    res.status(200).json({
      msg: "Produto adicionado ao carrinho com sucesso",
    });
    return;
  } else {
    let carrinho = await prisma.carrinho.findFirst({
      where: { statusAberto: true, usuarioId: usuarioId },
    });
    // caso não tenha carrinho aberto
    if (!carrinho) {
      carrinho = await prisma.carrinho.create({
        data: {
          statusAberto: true,
          usuarioId: usuarioId,
        },
      });
    }

    const itemCarrinho = await itemCarrinhoController.getItemCarrinho(
      carrinho.id,
      produtoId
    );

    if (itemCarrinho) {
      if (estoque.quantidadeDisponivel > 0) {
        await itemCarrinhoController.adicionarItemCarrinho(itemCarrinho);

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

      await itemCarrinhoController.criarInstanciaItemCarrinho(
        carrinho.id,
        produtoId,
        1
      );

      await estoqueController.removerItemEstoque(estoque, produtoId);
    }
  }

  res.status(200).json({
    msg: "Produto adicionado ao carrinho com sucesso",
  });
};

export const finalizarCompra = async (req, res) => {
  console.log("finalizarCompra");
  const token = req.headers.authorization.split(" ")[1];
  const usuarioId = jwtDecode(token).id;
  console.log(usuarioId);

  const usuario = await usuarioController.getUsuarioPorId(usuarioId);

  if (!usuario) {
    res.status(404).json({
      msg: "Usuário não encontrado",
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
      msg: "Não há carrinho aberto para este usuário, é preciso adicionar produtos ao carrinho antes de finalizar a compra",
    });
    return;
  }

  if (carrinho.itensCarrinho.length === 0) {
    res.status(400).json({
      msg: "Carrinho vazio",
    });
    return;
  }

  await prisma.carrinho.update({
    where: { id: carrinho.id },
    data: {
      statusAberto: false,
      fechadoEm: new Date(),
    },
  });

  res.status(200).json({
    msg: "Compra finalizada com sucesso",
  });
};
