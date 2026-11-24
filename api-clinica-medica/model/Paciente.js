export class Paciente {
  constructor(nome, cpf, data_nascimento) {
    this.nome = nome;
    this.cpf = cpf;
    this.data_nascimento = data_nascimento;
  }

  validar() {
    if (typeof this.nome !== "string" || this.nome.trim().length < 3) {
      throw new Error("Nome deve possuir pelo menos 3 caracteres.");
    }
    if (typeof this.cpf !== "string" || !/^\d{11}$/.test(this.cpf)) {
      throw new Error("CPF deve conter exatamente 11 números.");
    }
    if (!Paciente.dataValida(this.data_nascimento)) {
      throw new Error("Data de nascimento obrigatória e válida (AAAA-MM-DD).");
    }
  }

  static dataValida(valor) {
    if (typeof valor !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
    const data = new Date(`${valor}T00:00:00Z`);
    return !Number.isNaN(data.getTime()) && data.toISOString().slice(0, 10) === valor;
  }

  static validarId(id) {
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      throw new Error("ID deve ser um número inteiro positivo.");
    }
    return Number(id);
  }
}