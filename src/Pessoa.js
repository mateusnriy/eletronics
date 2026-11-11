import { Endereco } from "./Endereco.js";
import { validarTextoObrigatorio } from "./utils/validacoes.js";

/** Classe base abstrata dos clientes. Não pode ser instanciada diretamente. */
export class Pessoa {
  #nome;
  #endereco;

  /**
   * @param {string} nome
   * @param {Endereco} endereco
   */
  constructor(nome, endereco) {
    if (new.target === Pessoa) {
      throw new Error("Pessoa é uma classe abstrata e não pode ser instanciada diretamente.");
    }
    this.nome = nome;
    this.endereco = endereco;
  }

  get nome() {
    return this.#nome;
  }

  set nome(valor) {
    this.#nome = validarTextoObrigatorio(valor, "Nome", 3);
  }

  get endereco() {
    return this.#endereco;
  }

  set endereco(valor) {
    if (!(valor instanceof Endereco)) {
      throw new Error("Endereço deve ser uma instância de Endereco.");
    }
    this.#endereco = valor;
  }

  /**
   * Dados comuns às subclasses.
   * @protected
   * @returns {string}
   */
  _formatarDadosBase() {
    return `Nome: ${this.#nome}\n  Endereço: ${this.#endereco.formatar()}`;
  }

  /**
   * Contrato polimórfico: cada subclasse sobrescreve este método.
   * @abstract
   * @returns {string}
   */
  exibirDados() {
    return this._formatarDadosBase();
  }
}
