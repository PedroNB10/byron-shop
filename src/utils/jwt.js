import jwt from "jsonwebtoken";

export function gerarToken(usuario) {
  return jwt.sign(usuario, process.env.JWT_SECRET, {
    expiresIn: "1800s",
  });
}
