import jwt from "jsonwebtoken";

export default function autorizarUsuario(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (authHeader == null) {
    return res.status(401).json({
      msg: "Você precisa estar logado para acessar esse recurso",
    });
  }
  const tokenArray = authHeader.split(" ");

  if (tokenArray.length !== 2) {
    return res.status(401).json({
      msg: "Token enviado não está no formato adequado",
    });
  }

  const token = authHeader.split(" ")[1]; // ['Bearer', 'token'][1] (transforma em um array)

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(401).json({
          msg: "Você precisa estar logado para acessar esse recurso",
        });
      }

      next(); // se o token for válido, ele vai para a próxima função
    });
  } else {
    res.status(401).json({
      msg: "Você precisa estar logado para acessar esse recurso",
    });
  }
}
