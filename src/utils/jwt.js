import jwt from "jsonwebtoken";

export function gerarToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "3600s",
  });
}
