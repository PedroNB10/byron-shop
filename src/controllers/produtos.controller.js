import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const criarProduto = async (req, res) => {
  const data = req.body.data;

  if (
    !data.nome ||
    !data.descricao ||
    !data.preco ||
    !data.quantidadeDisponivel ||
    !data.categoria
  ) {
    res.status(400).json({
      msg: "Dados obrigatórios não foram preenchidos",
    });
  }

  const produto = await prisma.produto.create({
    data: {
      nome: data.nome,
      descricao: data.descricao,
      preco: data.preco,
      categoria: data.categoria,
      estoque: {
        create: {
          quantidadeDisponivel: data.quantidadeDisponivel,
        },
      },
      fotos: {
        create: {
          url: "/public/default.jpg",
        },
      },
    },
  });

  res.json({
    data: produto,
    msg: "Produto criado com sucesso",
  });
};

export const getProdutos = async (req, res) => {
  const produtos = await prisma.produto.findMany({
    include: {
      estoque: true,
    },
  });

  res.json({
    data: produtos,
  });
};

export const getProdutoPorIdParams = async (req, res) => {
  const produtoId = req.params.produtoId;

  const produto = await prisma.produto.findUnique({
    where: { id: parseInt(produtoId) },
    include: {
      estoque: true,
      fotos: true,
    },
  });

  if (!produto) {
    res.status(404).json({
      msg: "Produto não encontrado",
    });
    return;
  }

  res.json({
    data: produto,
    msg: "Produto encontrado com sucesso",
  });
};

export const getProdutoPorId = async (produtoId) => {
  const produto = await prisma.produto.findUnique({
    where: { id: produtoId },
  });

  return produto;
};

export const adicionarFotosAoProduto = async (req, res) => {
  const produtoId = req.params.produtoId;
  const fotos = req.files.fotos; // fotos é o nome do campo que contém as fotos

  if (!produtoId || !fotos) {
    res.status(400).json({
      msg: "Dados obrigatórios não foram preenchidos",
    });
  }

  const produtoExistente = await prisma.produto.findUnique({
    where: { id: parseInt(produtoId) },
    include: {
      fotos: true,
    },
  });

  if (!produtoExistente) {
    res.status(404).json({
      msg: "Produto não encontrado",
    });
    return;
  }

  if (produtoExistente.fotos.length > 5) {
    res.status(400).json({
      msg: "Produto atingiu o limite de fotos",
    });
    return;
  }

  const fotosUrl = await prisma.foto.createMany({
    data: fotos.map((foto) => {
      return {
        url: "/public/" + foto.filename,
        produtoId: parseInt(produtoId),
      };
    }),
  });

  const fotosDoProduto = await prisma.foto.findMany({
    where: { produtoId: parseInt(produtoId) },
  });

  console.log(fotosDoProduto);

  res.json({
    data: fotosDoProduto,
    msg: "Fotos adicionadas ao produto com sucesso",
  });
};
