import { test } from "node:test";
import assert from "node:assert/strict";
import { Endereco } from "../src/Endereco.js";
import { Pessoa } from "../src/Pessoa.js";
import { PessoaFisica } from "../src/PessoaFisica.js";
import { PessoaJuridica } from "../src/PessoaJuridica.js";

const end = () => new Endereco("Rua das Flores", 120, "São Paulo", "SP");
const pf = (o = {}) =>
  new PessoaFisica(o.nome ?? "Maria Souza", o.cpf ?? "123.456.789-01", o.nasc ?? "15/03/1990", end());
const pj = (o = {}) =>
  new PessoaJuridica(o.nome ?? "Electronic", o.cnpj ?? "12.345.678/0001-90", o.rs ?? "Electronic LTDA", end());

test("PF válida: normaliza CPF e herda de Pessoa", () => {
  const p = pf();
  assert.equal(p.cpf, "12345678901");
  assert.equal(p.formatarCpf(), "123.456.789-01");
  assert.equal(p.formatarDataNascimento(), "15/03/1990");
  assert.ok(p instanceof Pessoa);
});

test("PJ válida: normaliza CNPJ e herda de Pessoa", () => {
  const p = pj();
  assert.equal(p.cnpj, "12345678000190");
  assert.equal(p.formatarCnpj(), "12.345.678/0001-90");
  assert.ok(p instanceof Pessoa);
});

test("Pessoa é abstrata", () => {
  assert.throws(() => new Pessoa("Maria", end()), /abstrata/);
});

test("PF inválida: nome, CPF, data e endereço", () => {
  assert.throws(() => pf({ nome: "Jo" }), /ao menos 3/);
  assert.throws(() => pf({ cpf: "123" }), /11 dígitos/);
  assert.throws(() => pf({ cpf: "123.456.789-0a" }), /apenas dígitos/);
  assert.throws(() => pf({ nasc: "01/01/2999" }), /futuro/);
  assert.throws(() => pf({ nasc: "31/02/2000" }), /não existe/);
  assert.throws(() => pf({ nasc: "abc" }), /formato/);
  assert.throws(() => new PessoaFisica("Maria", "12345678901", "01/01/1990", {}), /Endereco/);
});

test("PJ inválida: CNPJ e razão social", () => {
  assert.throws(() => pj({ cnpj: "123" }), /14 dígitos/);
  assert.throws(() => pj({ rs: "  " }), /não pode ser vazio/);
});

test("Data de nascimento: bissexto válido e hoje aceito", () => {
  assert.doesNotThrow(() => pf({ nasc: "29/02/2024" }));
  assert.throws(() => pf({ nasc: "29/02/2023" }), /não existe/);
  assert.doesNotThrow(() => pf({ nasc: new Date() }));
});

test("Endereço: campos obrigatórios e UF", () => {
  assert.throws(() => new Endereco("", 1, "SP", "SP"), /Logradouro/);
  assert.throws(() => new Endereco("Rua", 1, "Cidade", "XX"), /UF/);
  assert.equal(new Endereco("Rua", 1, "Cidade", "sp").uf, "SP");
});

test("Encapsulamento: setters validam e getter de data devolve cópia", () => {
  const p = pf();
  assert.throws(() => { p.nome = "Al"; }, /ao menos 3/);
  assert.equal(p.nome, "Maria Souza");
  p.dataNascimento.setFullYear(2000);
  assert.equal(p.formatarDataNascimento(), "15/03/1990");
  assert.equal(Object.keys(p).length, 0);
});

test("Polimorfismo: exibirDados nas subclasses", () => {
  assert.match(pf().exibirDados(), /Pessoa Física[\s\S]*CPF/);
  assert.match(pj().exibirDados(), /Pessoa Jurídica[\s\S]*Razão social/);
});

