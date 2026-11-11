import { Pessoa } from "./Pessoa.js";
import { normalizarDocumento, validarDataNascimento } from "./utils/validacoes.js";

/** Cliente pessoa física. */
export class PessoaFisica extends Pessoa {
  #cpf;
  #dataNascimento;

  /**
   * @param {string} nome
   * @param {string} cpf 11 dígitos; pontos, traço e barra são ignorados.
   * @param {string|Date} dataNascimento
   * @param {import("./Endereco.js").Endereco} endereco
   */
  constructor(nome, cpf, dataNascimento, endereco) {
    super(nome, endereco);
    this.cpf = cpf;
    this.dataNascimento = dataNascimento;
  }

  get cpf() {
    return this.#cpf;
  }

  set cpf(valor) {
    this.#cpf = normalizarDocumento(valor, "CPF", 11);
  }

  get dataNascimento() {
    return new Date(this.#dataNascimento.getTime());
  }

  set dataNascimento(valor) {
    this.#dataNascimento = validarDataNascimento(valor);
  }

  /** @returns {string} Ex.: "123.456.789-01" */
  formatarCpf() {
    return this.#cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  }

  /** @returns {string} Ex.: "15/03/1990" */
  formatarDataNascimento() {
    const d = String(this.#dataNascimento.getDate()).padStart(2, "0");
    const m = String(this.#dataNascimento.getMonth() + 1).padStart(2, "0");
    return `${d}/${m}/${this.#dataNascimento.getFullYear()}`;
  }

  /** @override */
  exibirDados() {
    return (
      `[Pessoa Física]\n  ${super.exibirDados()}\n` +
      `  CPF: ${this.formatarCpf()}\n  Nascimento: ${this.formatarDataNascimento()}`
    );
  }
}
