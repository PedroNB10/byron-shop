import { PrismaClient } from "@prisma/client";
import { gerarToken } from "../utils/jwt.js";

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

export const getUsuarioPorId = async (req, res) => {
  // console.log(req.params.usuarioId);
  const usuario = await prisma.usuario.findFirst({
    where: {
      id: parseInt(req.params.usuarioId),
    },
    include: {
      carrinhos: true,
    },
  });

  if (!usuario) {
    res.status(404).json({
      msg: "Usuário não encontrado",
    });
    return;
  }

  res.json({
    data: usuario,
  });
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

  try {
    const usuario = await prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        cpf: data.cpf,
      },
    });

    const token = gerarToken(usuario);

    res.json({
      data: usuario,
      token: token,
      msg: "Categoria criada com sucesso",
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

  const token = gerarToken(usuario);

  res.json({
    data: usuario,
    token: token,
    msg: "Login realizado com sucesso",
  });
};
