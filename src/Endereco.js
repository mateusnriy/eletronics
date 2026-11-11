import { validarTextoObrigatorio, validarUf } from "./utils/validacoes.js";

/** Endereço de um cliente (composição de Pessoa). */
export class Endereco {
  #logradouro;
  #numero;
  #cidade;
  #uf;

  /**
   * @param {string} logradouro
   * @param {string|number} numero
   * @param {string} cidade
   * @param {string} uf
   */
  constructor(logradouro, numero, cidade, uf) {
    this.logradouro = logradouro;
    this.numero = numero;
    this.cidade = cidade;
    this.uf = uf;
  }

  get logradouro() {
    return this.#logradouro;
  }

  set logradouro(valor) {
    this.#logradouro = validarTextoObrigatorio(valor, "Logradouro");
  }

  get numero() {
    return this.#numero;
  }

  set numero(valor) {
    const texto = typeof valor === "number" ? String(valor) : valor;
    this.#numero = validarTextoObrigatorio(texto, "Número");
  }

  get cidade() {
    return this.#cidade;
  }

  set cidade(valor) {
    this.#cidade = validarTextoObrigatorio(valor, "Cidade");
  }

  get uf() {
    return this.#uf;
  }

  set uf(valor) {
    this.#uf = validarUf(valor);
  }

  /** @returns {string} Ex.: "Rua das Flores, 123 - São Paulo/SP" */
  formatar() {
    return `${this.#logradouro}, ${this.#numero} - ${this.#cidade}/${this.#uf}`;
  }
}
