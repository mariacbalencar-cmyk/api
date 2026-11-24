import { conexao } from "../config/conexao.js";

export async function adicionar(consulta) {
  const [resultado] = await conexao.execute(
    "INSERT INTO consulta (data_hora, motivo, status) VALUES (?, ?, ?)",
    [consulta.data_hora.replace("T", " "), consulta.motivo.trim(), consulta.status]
  );
  return resultado.insertId;
}
export async function listar() {
  const [linhas] = await conexao.execute(`
    SELECT c.*, m.nome AS medico_nome, m.crm, m.especialidade,
           p.nome AS paciente_nome, p.cpf, p.data_nascimento
    FROM consulta c
    LEFT JOIN medico m ON c.fk_id_medico = m.id_medico
    LEFT JOIN paciente p ON c.fk_id_paciente = p.id_paciente
    ORDER BY c.id_consulta
  `);
  return linhas;
}
export async function buscarPorId(id) {
  const [linhas] = await conexao.execute(`
    SELECT c.*,
      m.id_medico, m.nome AS medico_nome, m.crm, m.especialidade,
      p.id_paciente, p.nome AS paciente_nome, p.cpf, p.data_nascimento
    FROM consulta c
    LEFT JOIN medico m ON c.fk_id_medico = m.id_medico
    LEFT JOIN paciente p ON c.fk_id_paciente = p.id_paciente
    WHERE c.id_consulta = ?
  `, [id]);
  return linhas[0] || null;
}
export async function atualizar(id, dados) {
  const campos = [];
  const valores = [];
  for (const campo of ["data_hora", "motivo", "status"]) {
    if (dados[campo] !== undefined) {
      campos.push(`${campo} = ?`);
      valores.push(campo === "data_hora" ? dados[campo].replace("T", " ") : dados[campo]);
    }
  }
  if (!campos.length) return false;
  valores.push(id);
  const [resultado] = await conexao.execute(
    `UPDATE consulta SET ${campos.join(", ")} WHERE id_consulta = ?`, valores
  );
  return resultado.affectedRows > 0;
}
export async function deletar(id) {
  const [resultado] = await conexao.execute("DELETE FROM consulta WHERE id_consulta = ?", [id]);
  return resultado.affectedRows > 0;
}
export async function vincularMedico(idConsulta, idMedico) {
  const [resultado] = await conexao.execute(
    "UPDATE consulta SET fk_id_medico = ? WHERE id_consulta = ?", [idMedico, idConsulta]
  );
  return resultado.affectedRows > 0;
}
export async function removerMedico(idConsulta) {
  const [resultado] = await conexao.execute(
    "UPDATE consulta SET fk_id_medico = NULL WHERE id_consulta = ?", [idConsulta]
  );
  return resultado.affectedRows > 0;
}
export async function vincularPaciente(idConsulta, idPaciente) {
  const [resultado] = await conexao.execute(
    "UPDATE consulta SET fk_id_paciente = ? WHERE id_consulta = ?", [idPaciente, idConsulta]
  );
  return resultado.affectedRows > 0;
}
export async function removerPaciente(idConsulta) {
  const [resultado] = await conexao.execute(
    "UPDATE consulta SET fk_id_paciente = NULL WHERE id_consulta = ?", [idConsulta]
  );
  return resultado.affectedRows > 0;
}