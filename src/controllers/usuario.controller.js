import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

    res.json({
      data: usuario,
      msg: "Categoria criada com sucesso",
    });
  } catch {
    res.status(400).json({
      msg: "Erro ao criar usuário",
    });
  }
};
