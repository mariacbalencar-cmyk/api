import { conexao } from "../config/conexao.js";

export async function adicionar(medico) {
  const [resultado] = await conexao.execute(
    "INSERT INTO medico (nome, crm, especialidade) VALUES (?, ?, ?)",
    [medico.nome.trim(), medico.crm.trim(), medico.especialidade.trim()]
  );
  return resultado.insertId;
}
export async function listar() {
  const [linhas] = await conexao.execute("SELECT * FROM medico ORDER BY id_medico");
  return linhas;
}
export async function buscarPorId(id) {
  const [linhas] = await conexao.execute("SELECT * FROM medico WHERE id_medico = ?", [id]);
  return linhas[0] || null;
}
export async function atualizar(id, dados) {
  const campos = [];
  const valores = [];
  for (const campo of ["nome", "crm", "especialidade"]) {
    if (dados[campo] !== undefined) {
      campos.push(`${campo} = ?`);
      valores.push(dados[campo]);
    }
  }
  if (!campos.length) return false;
  valores.push(id);
  const [resultado] = await conexao.execute(
    `UPDATE medico SET ${campos.join(", ")} WHERE id_medico = ?`, valores
  );
  return resultado.affectedRows > 0;
}
export async function deletar(id) {
  const [resultado] = await conexao.execute("DELETE FROM medico WHERE id_medico = ?", [id]);
  return resultado.affectedRows > 0;
}