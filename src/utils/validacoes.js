/**
 * Funções puras de validação e normalização reutilizadas pelas classes do domínio.
 * Todas lançam `Error` com mensagem descritiva quando o valor não é permitido.
 */

export const UFS_VALIDAS = Object.freeze([
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
]);

/**
 * Valida texto obrigatório e retorna o valor sem espaços nas extremidades.
 * @param {unknown} valor
 * @param {string} campo Nome do campo para a mensagem de erro.
 * @param {number} [tamanhoMinimo=1]
 * @returns {string}
 */
export function validarTextoObrigatorio(valor, campo, tamanhoMinimo = 1) {
  if (typeof valor !== "string") {
    throw new Error(`${campo} deve ser um texto.`);
  }
  const texto = valor.trim();
  if (texto.length === 0) {
    throw new Error(`${campo} não pode ser vazio.`);
  }
  if (texto.length < tamanhoMinimo) {
    throw new Error(`${campo} deve ter ao menos ${tamanhoMinimo} caracteres.`);
  }
  return texto;
}

/**
 * Remove pontos, traço e barra e exige exatamente `quantidade` dígitos.
 * @param {unknown} valor
 * @param {string} campo
 * @param {number} quantidade
 * @returns {string} Somente dígitos.
 */
export function normalizarDocumento(valor, campo, quantidade) {
  if (typeof valor !== "string") {
    throw new Error(`${campo} deve ser um texto.`);
  }
  const digitos = valor.trim().replace(/[.\-/]/g, "");
  if (!/^\d+$/.test(digitos)) {
    throw new Error(`${campo} deve conter apenas dígitos (pontos, traço e barra são ignorados).`);
  }
  if (digitos.length !== quantidade) {
    throw new Error(`${campo} deve ter ${quantidade} dígitos, mas possui ${digitos.length}.`);
  }
  return digitos;
}

/**
 * Converte "DD/MM/AAAA", "AAAA-MM-DD" ou Date em Date válida e não futura.
 * @param {unknown} valor
 * @returns {Date}
 */
export function validarDataNascimento(valor) {
  let ano;
  let mes;
  let dia;

  if (valor instanceof Date) {
    if (Number.isNaN(valor.getTime())) {
      throw new Error("Data de nascimento inválida.");
    }
    ano = valor.getFullYear();
    mes = valor.getMonth() + 1;
    dia = valor.getDate();
  } else if (typeof valor === "string") {
    const texto = valor.trim();
    let partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
    if (partes) {
      [, dia, mes, ano] = partes.map(Number);
    } else {
      partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(texto);
      if (!partes) {
        throw new Error("Data de nascimento deve estar no formato DD/MM/AAAA ou AAAA-MM-DD.");
      }
      [, ano, mes, dia] = partes.map(Number);
    }
  } else {
    throw new Error("Data de nascimento deve ser um texto ou uma Date.");
  }

  const data = new Date(ano, mes - 1, dia);
  const existe =
    data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia;
  if (!existe) {
    throw new Error("Data de nascimento não existe no calendário.");
  }

  const agora = new Date();
  const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  if (data > hoje) {
    throw new Error("Data de nascimento não pode estar no futuro.");
  }
  return data;
}

/**
 * Valida e normaliza a sigla de UF.
 * @param {unknown} valor
 * @returns {string}
 */
export function validarUf(valor) {
  const uf = validarTextoObrigatorio(valor, "UF").toUpperCase();
  if (!UFS_VALIDAS.includes(uf)) {
    throw new Error(`UF "${uf}" não é uma sigla válida.`);
  }
  return uf;
}

