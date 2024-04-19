import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const adicionarProdutoAoCarrinho = async (req, res) => {
  const data = req.body.data;
  console.log(data);

  const { produtoId, usuarioId, quantidade } = data;

  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
    include: {
      carrinhos: {
        include: {
          itensCarrinho: {
            include: {
              produto: true,
            },
          },
        },
      },
    },
  });

  if (!usuario) {
    res.status(404).json({
      msg: "Usuário não encontrado",
    });
    return;
  }

  console.log(usuario);
  console.log("items no carrinho");
  //   console.log(usuario.carrinhos[0].itensCarrinho);

  if (usuario.carrinhos.length === 0) {
    const carrinho = await prisma.carrinho.create({
      data: {
        statusAberto: true,
        usuarioId: usuarioId,
        itensCarrinho: {
          create: {
            produtoId: produtoId,
            quantidade: quantidade,
          },
        },
      },
    });

    const estoque = await prisma.estoque.findFirst({
      where: { id: produtoId },
    });

    if (estoque.quantidadeDisponivel < quantidade) {
      res.status(400).json({
        msg: "Quantidade insuficiente em estoque",
      });
      return;
    }

    const novoEstoque = await prisma.estoque.update({
      where: { id: produtoId },
      data: {
        quantidadeDisponivel: estoque.quantidadeDisponivel - quantidade,
      },
    });
  } else {
    const carrinho = await prisma.carrinho.findFirst({
      where: { statusAberto: true, usuarioId: usuarioId },
    });
    console.log("carrinho aberto:");
    console.log(carrinho);

    const estoque = await prisma.estoque.findFirst({
      where: { id: produtoId },
    });

    const itemCarrinho = await prisma.itemCarrinho.findFirst({
      where: { carrinhoId: carrinho.id, produtoId: produtoId },
    });

    if (itemCarrinho) {
      await prisma.itemCarrinho.update({
        where: { id: itemCarrinho.id },
        data: {
          quantidade: itemCarrinho.quantidade + quantidade,
        },
      });

      if (estoque.quantidadeDisponivel < quantidade) {
        res.status(400).json({
          msg: "Quantidade insuficiente em estoque",
        });
        return;
      }

      const novoEstoque = await prisma.estoque.update({
        where: { id: produtoId },
        data: {
          quantidadeDisponivel: estoque.quantidadeDisponivel - quantidade,
        },
      });
    } else {
      await prisma.itemCarrinho.create({
        data: {
          carrinhoId: carrinho.id,
          produtoId: produtoId,
          quantidade: quantidade,
        },
      });

      if (estoque.quantidadeDisponivel < quantidade) {
        res.status(400).json({
          msg: "Quantidade insuficiente em estoque",
        });
        return;
      }

      const novoEstoque = await prisma.estoque.update({
        where: { id: produtoId },
        data: {
          quantidadeDisponivel: estoque.quantidadeDisponivel - quantidade,
        },
      });
    }
  }

  res.json({
    data: "carrinho",
    msg: "Produto adicionado ao carrinho com sucesso",
  });
};
