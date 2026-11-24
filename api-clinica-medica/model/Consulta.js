export class Consulta {
  constructor(data_hora, motivo, status = "rascunho") {
    this.data_hora = data_hora;
    this.motivo = motivo;
    this.status = status;
  }

  validar() {
    if (typeof this.data_hora !== "string" || !/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?$/.test(this.data_hora)
      || Number.isNaN(new Date(this.data_hora.replace(" ", "T")).getTime())) {
      throw new Error("Data e hora obrigatórias e válidas (AAAA-MM-DD HH:MM:SS).");
    }
    if (typeof this.motivo !== "string" || this.motivo.trim().length < 5) {
      throw new Error("Motivo deve possuir pelo menos 5 caracteres.");
    }
    if (!["rascunho", "agendada", "concluida", "cancelada"].includes(this.status)) {
      throw new Error("Status deve ser rascunho, agendada, concluida ou cancelada.");
    }
  }

  static validarId(id) {
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      throw new Error("ID deve ser um número inteiro positivo.");
    }
    return Number(id);
  }
}