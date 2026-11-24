export class Medico {
  constructor(nome, crm, especialidade) {
    this.nome = nome;
    this.crm = crm;
    this.especialidade = especialidade;
  }

  validar() {
    if (typeof this.nome !== "string" || this.nome.trim().length < 3) {
      throw new Error("Nome deve possuir pelo menos 3 caracteres.");
    }
    if (typeof this.crm !== "string" || !this.crm.trim()) {
      throw new Error("CRM é obrigatório.");
    }
    if (typeof this.especialidade !== "string" || this.especialidade.trim().length < 3) {
      throw new Error("Especialidade deve possuir pelo menos 3 caracteres.");
    }
  }

  static validarId(id) {
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      throw new Error("ID deve ser um número inteiro positivo.");
    }
    return Number(id);
  }
}