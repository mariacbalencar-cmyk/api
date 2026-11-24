import { conexao } from "../config/conexao.js";

export async function adicionar(paciente) {
  const [resultado] = await conexao.execute(
    "INSERT INTO paciente (nome, cpf, data_nascimento) VALUES (?, ?, ?)",
    [paciente.nome.trim(), paciente.cpf, paciente.data_nascimento]
  );
  return resultado.insertId;
}
export async function listar() {
  const [linhas] = await conexao.execute("SELECT * FROM paciente ORDER BY id_paciente");
  return linhas;
}
export async function buscarPorId(id) {
  const [linhas] = await conexao.execute("SELECT * FROM paciente WHERE id_paciente = ?", [id]);
  return linhas[0] || null;
}
export async function atualizar(id, dados) {
  const campos = [];
  const valores = [];
  for (const campo of ["nome", "cpf", "data_nascimento"]) {
    if (dados[campo] !== undefined) {
      campos.push(`${campo} = ?`);
      valores.push(dados[campo]);
    }
  }
  if (!campos.length) return false;
  valores.push(id);
  const [resultado] = await conexao.execute(
    `UPDATE paciente SET ${campos.join(", ")} WHERE id_paciente = ?`, valores
  );
  return resultado.affectedRows > 0;
}
export async function deletar(id) {
  const [resultado] = await conexao.execute("DELETE FROM paciente WHERE id_paciente = ?", [id]);
  return resultado.affectedRows > 0;
}