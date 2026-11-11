import { Pessoa } from "./Pessoa.js";
import { normalizarDocumento, validarTextoObrigatorio } from "./utils/validacoes.js";

/** Cliente pessoa jurídica. */
export class PessoaJuridica extends Pessoa {
  #cnpj;
  #razaoSocial;

  /**
   * @param {string} nome
   * @param {string} cnpj 14 dígitos; pontos, traço e barra são ignorados.
   * @param {string} razaoSocial
   * @param {import("./Endereco.js").Endereco} endereco
   */
  constructor(nome, cnpj, razaoSocial, endereco) {
    super(nome, endereco);
    this.cnpj = cnpj;
    this.razaoSocial = razaoSocial;
  }

  get cnpj() {
    return this.#cnpj;
  }

  set cnpj(valor) {
    this.#cnpj = normalizarDocumento(valor, "CNPJ", 14);
  }

  get razaoSocial() {
    return this.#razaoSocial;
  }

  set razaoSocial(valor) {
    this.#razaoSocial = validarTextoObrigatorio(valor, "Razão social");
  }

  /** @returns {string} Ex.: "12.345.678/0001-90" */
  formatarCnpj() {
    return this.#cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  }

  /** @override */
  exibirDados() {
    return (
      `[Pessoa Jurídica]\n  ${super.exibirDados()}\n` +
      `  CNPJ: ${this.formatarCnpj()}\n  Razão social: ${this.#razaoSocial}`
    );
  }
}
