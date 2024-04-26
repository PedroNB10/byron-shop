import { PrismaClient } from "@prisma/client";
import { jwtDecode } from "jwt-decode";

const prisma = new PrismaClient();

export const criarProduto = async (req, res) => {
  const { nome, descricao, preco, quantidadeDisponivel, categoria } = req.body;

  if (!nome || !descricao || !preco || !quantidadeDisponivel || !categoria) {
    res.status(400).json({
      msg: "Dados obrigatórios não foram preenchidos",
    });
  }
  const token = req.headers.authorization.split(" ")[1];
  const usuarioId = jwtDecode(token).id;

  const usuarioExistente = await prisma.usuario.findUnique({
    where: { id: usuarioId },
  });

  if (usuarioExistente.role !== "ADMIN") {
    res.status(403).json({
      msg: "Você não tem permissão para criar um produto, somente administradores podem criar produtos",
    });
    return;
  }

  if (!usuarioExistente) {
    res.status(404).json({
      msg: "Usuário não encontrado",
    });
    return;
  }

  const produto = await prisma.produto.create({
    data: {
      nome: nome,
      descricao: descricao,
      preco: preco,
      categoria: categoria,
      estoque: {
        create: {
          quantidadeDisponivel: quantidadeDisponivel,
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
  const query = req.query;
  console.log(query);
  if (query.nome === undefined && query.categoria === undefined) {
    const produtos = await prisma.produto.findMany({
      include: {
        estoque: true,
      },
    });

    res.json({
      data: produtos,
    });
    return;
  }

  console.log(query);

  let nome = query.nome;
  let categoria = query.categoria;

  if (nome && !categoria) {
    const produtos = await prisma.produto.findMany({
      where: {
        nome: {
          contains: nome,
        },

        NOT: {
          estoque: {
            quantidadeDisponivel: 0,
          },
        },
      },
      include: {
        estoque: true,
      },
    });

    res.json({
      data: produtos,
    });
    return;
  }

  if (!nome && categoria) {
    const produtos = await prisma.produto.findMany({
      where: {
        categoria: categoria,
        NOT: {
          estoque: {
            quantidadeDisponivel: 0,
          },
        },
      },
      include: {
        estoque: true,
      },
    });

    res.json({
      data: produtos,
    });
    return;
  }

  if (nome && categoria) {
    const produtos = await prisma.produto.findMany({
      where: {
        nome: {
          contains: nome,
        },
        categoria: categoria,
        NOT: {
          estoque: {
            quantidadeDisponivel: 0,
          },
        },
      },
      include: {
        estoque: true,
      },
    });

    res.json({
      data: produtos,
    });
    return;
  }

  res.status(400).json({
    msg: "Parâmetros de query não implementados!",
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

export const getProdutosPorCategoria = async (req, res) => {};
