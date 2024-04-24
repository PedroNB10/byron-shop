import { PrismaClient } from "@prisma/client";
import { gerarToken } from "../utils/jwt.js";
import * as regex from "../utils/validar-cadastro.js";
const prisma = new PrismaClient();

export const getUsuarios = async (req, res) => {
  const usuarios = await prisma.usuario.findMany({
    include: {
      carrinhos: true,
    },
  });

  res.json({
    data: usuarios,
  });
};

// função para pegar o usuário por json
// export const getUsuarioPorId = async (req, res) => {
//   // console.log(req.params.usuarioId);
//   const usuario = await prisma.usuario.findFirst({
//     where: {
//       id: parseInt(req.params.usuarioId),
//     },
//     include: {
//       carrinhos: true,
//     },
//   });

//   if (!usuario) {
//     res.status(404).json({
//       msg: "Usuário não encontrado",
//     });
//     return;
//   }

//   res.json({
//     data: usuario,
//   });
// };
export const getUsuarioPorIdParams = async (req, res) => {
  const usuarioId = req.params.usuarioId;

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

  res.status(200).json({
    data: usuario,
    msg: "Usuário encontrado com sucesso",
  });
};

export const getUsuarioPorId = async (usuarioId) => {
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

  return usuario;
};

export const criarUsuario = async (req, res) => {
  const data = req.body.data;
  console.log(data);
  if (!data.email || !data.nome || !data.senha || !data.cpf) {
    res.status(400).json({
      msg: "Dados obrigatórios não foram preenchidos",
    });
  }

  const usuarioExistente = await prisma.usuario.findFirst({
    where: {
      OR: [
        {
          email: data.email,
        },
        {
          cpf: data.cpf,
        },
      ],
    },
  });

  if (usuarioExistente) {
    res.status(400).json({
      msg: "Existe um usuário com o mesmo email ou cpf cadastrado",
    });
    return;
  }

  if (!regex.validarEmail(data.email)) {
    res.status(400).json({
      msg: "Digite um e-mail válido!",
    });
    return;
  }

  if (!regex.validarSenha(data.senha)) {
    res.status(400).json({
      msg: "A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial",
    });
    return;
  }

  if (!regex.validarCPF(data.cpf)) {
    res.status(400).json({
      msg: "O CPF deve conter 11 dígitos",
    });
    return;
  }

  try {
    const usuario = await prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        cpf: data.cpf,
      },
    });

    const token = gerarToken({
      id: usuario.id,
      name: usuario.name
    });

    res.json({
      data: usuario,
      token: token,
      msg: "Usuário criado com sucesso",
    });
  } catch {
    res.status(400).json({
      msg: "Erro ao criar usuário",
    });
  }
};

export const login = async (req, res) => {
  const data = req.body.data;

  if (!data.email || !data.senha) {
    res.status(400).json({
      msg: "Dados obrigatórios não foram preenchidos",
    });
  }

  const usuario = await prisma.usuario.findFirst({
    where: {
      AND: [
        {
          email: data.email,
        },
        {
          senha: data.senha,
        },
      ],
    },
  });

  if (!usuario) {
    res.status(401).json({
      msg: "Login ou a senha Estão incorretos, rota não autorizada",
    });
    return;
  }

  const token = gerarToken({
    id: usuario.id,
    name: usuario.name
  });

  res.json({
    data: usuario,
    token: token,
    msg: "Login realizado com sucesso",
  });
};
