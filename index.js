import { Endereco } from "./src/Endereco.js";
import { PessoaFisica } from "./src/PessoaFisica.js";
import { PessoaJuridica } from "./src/PessoaJuridica.js";

/** Lista de clientes: contém apenas cadastros válidos. */
const clientes = [];

/**
 * Executa a criação de um cliente; se lançar erro, informa o usuário e segue o programa.
 * @param {string} descricao
 * @param {() => import("./src/Pessoa.js").Pessoa} criar
 */
function cadastrar(descricao, criar) {
  console.log(`\n>>> ${descricao}`);
  try {
    const cliente = criar();
    clientes.push(cliente);
    console.log("    OK: cadastro realizado com sucesso.");
  } catch (erro) {
    console.log(`    ERRO: cadastro rejeitado -> ${erro.message}`);
  }
}

console.log("=== Cadastro de clientes - Electronic (Appfull) ===");

// Cenário 1: Pessoa Física válida
cadastrar("Cenário 1 - Pessoa Física válida", () =>
  new PessoaFisica(
    "Maria Souza",
    "123.456.789-01",
    "15/03/1990",
    new Endereco("Rua das Flores", 120, "São Paulo", "SP"),
  ),
);

// Cenário 2: Pessoa Jurídica válida
cadastrar("Cenário 2 - Pessoa Jurídica válida", () =>
  new PessoaJuridica(
    "Electronic Atacado",
    "12.345.678/0001-90",
    "Electronic Comércio de Eletrônicos LTDA",
    new Endereco("Av. Paulista", "1000", "São Paulo", "SP"),
  ),
);

// Cenário 3: Pessoa Física inválida (nome curto)
cadastrar("Cenário 3a - Pessoa Física inválida (nome com 2 caracteres)", () =>
  new PessoaFisica("Jo", "123.456.789-01", "10/10/1985", new Endereco("Rua A", 1, "Recife", "PE")),
);
cadastrar("Cenário 3b - Pessoa Física inválida (CPF com 10 dígitos)", () =>
  new PessoaFisica("João Lima", "123.456.789-0", "10/10/1985", new Endereco("Rua A", 1, "Recife", "PE")),
);
cadastrar("Cenário 3c - Pessoa Física inválida (data de nascimento no futuro)", () =>
  new PessoaFisica("Ana Costa", "111.222.333-44", "01/01/2999", new Endereco("Rua B", 2, "Salvador", "BA")),
);
cadastrar("Cenário 3d - Pessoa Física inválida (data inexistente 31/02/2000)", () =>
  new PessoaFisica("Carlos Dias", "111.222.333-44", "31/02/2000", new Endereco("Rua C", 3, "Natal", "RN")),
);

// Cenário 4: Pessoa Jurídica inválida
cadastrar("Cenário 4a - Pessoa Jurídica inválida (razão social vazia)", () =>
  new PessoaJuridica("Loja Gadgets", "98.765.432/0001-10", "   ", new Endereco("Rua D", 4, "Curitiba", "PR")),
);
cadastrar("Cenário 4b - Pessoa Jurídica inválida (CNPJ com 13 dígitos)", () =>
  new PessoaJuridica("Loja Gadgets", "98.765.432/0001-1", "Gadgets LTDA", new Endereco("Rua D", 4, "Curitiba", "PR")),
);

// Cenário 5: encapsulamento - setter rejeita valor inválido em objeto já cadastrado
console.log("\n>>> Cenário 5 - Alteração inválida via setter em cliente já cadastrado");
try {
  clientes[0].nome = "Al";
} catch (erro) {
  console.log(`    ERRO: alteração rejeitada -> ${erro.message}`);
}
console.log(`    Nome preservado: ${clientes[0].nome}`);

// Resultado final: apenas cadastros válidos (polimorfismo em exibirDados)
console.log(`\n=== Clientes cadastrados com sucesso: ${clientes.length} ===`);
clientes.forEach((cliente, i) => console.log(`\n#${i + 1} ${cliente.exibirDados()}`));
