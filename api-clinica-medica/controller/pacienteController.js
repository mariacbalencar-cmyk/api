import { Paciente } from "../model/Paciente.js";
import * as repo from "../repository/pacienteRepository.js";

function erro(res, e) {
  if (e.code === "ER_DUP_ENTRY") return res.status(409).json({ mensagem: "CPF já cadastrado." });
  return res.status(400).json({ mensagem: e.message || "Dados inválidos." });
}
export async function cadastrar(req, res) {
  try {
    const paciente = new Paciente(req.body.nome, req.body.cpf, req.body.data_nascimento);
    paciente.validar();
    const id = await repo.adicionar(paciente);
    return res.status(201).json({ mensagem: "Paciente cadastrado com sucesso.", id_paciente: id });
  } catch (e) { return erro(res, e); }
}
export async function listar(req, res) {
  try { return res.status(200).json(await repo.listar()); }
  catch { return res.status(500).json({ mensagem: "Erro ao listar pacientes." }); }
}
export async function buscarPorId(req, res) {
  try {
    const id = Paciente.validarId(req.params.id);
    const paciente = await repo.buscarPorId(id);
    if (!paciente) return res.status(404).json({ mensagem: "Paciente não encontrado." });
    return res.status(200).json(paciente);
  } catch (e) { return erro(res, e); }
}
export async function atualizar(req, res) {
  try {
    const id = Paciente.validarId(req.params.id);
    const atual = await repo.buscarPorId(id);
    if (!atual) return res.status(404).json({ mensagem: "Paciente não encontrado." });
    const dados = { ...req.body };
    for (const campo of Object.keys(dados)) if (!["nome", "cpf", "data_nascimento"].includes(campo)) delete dados[campo];
    const validado = new Paciente(dados.nome ?? atual.nome, dados.cpf ?? atual.cpf, dados.data_nascimento ?? String(atual.data_nascimento).slice(0, 10));
    validado.validar();
    const alterou = await repo.atualizar(id, dados);
    return res.status(200).json({ mensagem: alterou ? "Paciente atualizado." : "Nenhum campo enviado para atualização." });
  } catch (e) { return erro(res, e); }
}
export async function excluir(req, res) {
  try {
    const id = Paciente.validarId(req.params.id);
    if (!await repo.deletar(id)) return res.status(404).json({ mensagem: "Paciente não encontrado." });
    return res.status(200).json({ mensagem: "Paciente excluído. Consultas vinculadas foram mantidas." });
  } catch { return res.status(500).json({ mensagem: "Erro ao excluir paciente." }); }
}