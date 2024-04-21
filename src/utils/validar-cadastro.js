// Função para validar e-mail
// Esta função usa uma regex que verifica se o e-mail está no formato correto, com caracteres permitidos antes do @, seguido de um domínio e um TLD (Top-Level Domain) de 2 a 6 letras.
export function validarEmail(email) {
  var regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regexEmail.test(email);
}

// Função para validar senha
// A função de validação de senha utiliza uma regex que assegura que a senha tenha pelo menos uma letra minúscula, uma maiúscula, um número e um caractere especial. Além disso, a senha deve ter no mínimo 8 caracteres.
export function validarSenha(senha) {
  var regexSenha =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regexSenha.test(senha);
}

// Função para validar CPF
// A função de validação de CPF utiliza uma regex que verifica se o CPF contém exatamente 11 dígitos.
export function validarCPF(cpf) {
  var regexCPFSemPontos = /^\d{11}$/;
  return regexCPFSemPontos.test(cpf);
}

// Testes
console.log(validarEmail("exemplo@dominio.com")); // true ou false
console.log(validarSenha("Senha@123")); // true ou false
console.log(validarCPF("123456789020")); // true ou false
