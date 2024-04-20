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
      Estoque: {
        create: {
          quantidadeDisponivel: data.quantidadeDisponivel,
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
  const produtos = await prisma.produto.findMany();

  res.json({
    data: produtos,
  });
};

export const getProdutoPorId = async (produtoId) => {
  const produto = await prisma.produto.findUnique({
    where: { id: produtoId },
  });

  return produto;
};
// export const adicionarProdutoAoCarrinho = async (req, res) => {
//   console.log(req.body.data);

//   const { produtoId, usuarioId, quantidadePedida } = req.body.data;

//   const usuario = await prisma.usuario.findUnique({
//     where: { id: usuarioId },
//   });

//   if (usuario.carrinhos.length === 0) {
//     const carrinho = await prisma.carrinho.create({
//       data: {
//         statusAberto: true,
//         usuarioId: usuarioId,
//         produtos: {
//           create: {
//             produtoId: produtoId,
//             quantidade: quantidadePedida,
//           },
//         },
//       },
//     });

//     res.json({
//       data: carrinho,
//       msg: "Produto adicionado ao carrinho com sucesso",
//     });
//   } else {
//     const carrinho = await prisma.carrinho.update({
//       where: { usuarioId: usuarioId },
//       data: {
//         produtos: {
//           create: {
//             produtoId: produtoId,
//             quantidade: quantidadePedida,
//           },
//         },
//       },
//     });

//     res.json({
//       data: carrinho,
//       msg: "Produto adicionado ao carrinho com sucesso",
//     });
//   }
// };

// export const adicionarProdutoAoCarrinho = async (req, res) => {
//   console.log(req.body.data);
//   const { produtoId, usuarioId, quantidade } = req.body.data;

//   if (!produtoId || !usuarioId || !quantidade) {
//     res.status(400).json({
//       msg: "Dados obrigatórios não foram preenchidos",
//     });
//   }

//   const produto = await prisma.produto.findUnique({
//     where: { id: produtoId },
//   });

//   if (!produto) {
//     res.status(404).json({
//       msg: "Produto não encontrado",
//     });
//     return;
//   }

//   if (produto.quantidadeDisponivel < quantidade) {
//     res.status(400).json({
//       msg: "Quantidade solicitada maior que a disponível",
//     });
//     return;
//   } else {
//     let quantidadeDisponivel = produto.quantidadeDisponivel - quantidade;

//     const produtoAtualizado = await prisma.produto.update({
//       where: { id: produtoId },
//       data: { quantidadeDisponivel: produto.quantidadeDisponivel - quantidade },
//     });
//   }

//   const usuarioComCarrinhos = await prisma.usuario.findUnique({
//     where: { id: usuarioId },
//     include: {
//       carrinhos: {
//         where: {
//           statusAberto: true,
//         },
//       },
//     },
//   });

//   if (!usuarioComCarrinhos) {
//     res.status(404).json({
//       msg: "Usuário não encontrado ou não possui carrinho aberto",
//     });
//     return;
//   }

//   if (usuarioComCarrinhos && usuarioComCarrinhos.carrinhos.length > 0) {
//     console.log("O usuário tem pelo menos um carrinho com estado aberto.");

//     // await prisma.carrinho.update({
//     //   where: { id: usuarioComCarrinhos.carrinhos[0].id }, // Use o primeiro carrinho encontrado
//     //   data: {
//     //     produtos: { connect: [{ id: produtoId }] },
//     //   },
//     // });

//     await prisma.carrinho.update({
//       where: { statusAberto: true },
//       data: {
//         produtos: { connect: [{ id: produtoId }] },
//       },
//     });

//     await prisma.carrinho.update({
//       where: { statusAberto: true },
//       data: {
//         produtos: {
//           create: {
//             id: produto.id,
//             nome: produto.nome,
//             descricao: produto.descricao,
//             preco: produto.preco,
//             categoria: produto.categoria,
//             quantidadeDisponivel: produto.quantidadeDisponivel,
//           },
//         },
//       },
//     });

//     return usuarioComCarrinhos.carrinhos; // Retorna os carrinhos abertos
//   } else {
//     // Crie um novo carrinho para o usuário
//     const novoCarrinho = await prisma.carrinho.create({
//       data: {
//         usuarioId,
//         statusAberto: true,
//         produtos: { connect: [{ id: produtoId }] }, // Adiciona o produto ao carrinho
//       },
//     });
//     console.log("Novo carrinho criado para o usuário.");
//     return [novoCarrinho]; // Retorna o novo carrinho criado
//   }
// };
