import { Medico } from "../model/Medico.js";
import * as repo from "../repository/medicoRepository.js";

function erro(res, e) {
  if (e.code === "ER_DUP_ENTRY") return res.status(409).json({ mensagem: "CRM já cadastrado." });
  return res.status(400).json({ mensagem: e.message || "Dados inválidos." });
}
export async function cadastrar(req, res) {
  try {
    const medico = new Medico(req.body.nome, req.body.crm, req.body.especialidade);
    medico.validar();
    const id = await repo.adicionar(medico);
    return res.status(201).json({ mensagem: "Médico cadastrado com sucesso.", id_medico: id });
  } catch (e) { return erro(res, e); }
}
export async function listar(req, res) {
  try { return res.status(200).json(await repo.listar()); }
  catch { return res.status(500).json({ mensagem: "Erro ao listar médicos." }); }
}
export async function buscarPorId(req, res) {
  try {
    const id = Medico.validarId(req.params.id);
    const medico = await repo.buscarPorId(id);
    if (!medico) return res.status(404).json({ mensagem: "Médico não encontrado." });
    return res.status(200).json(medico);
  } catch (e) { return erro(res, e); }
}
export async function atualizar(req, res) {
  try {
    const id = Medico.validarId(req.params.id);
    const atual = await repo.buscarPorId(id);
    if (!atual) return res.status(404).json({ mensagem: "Médico não encontrado." });
    const dados = { ...req.body };
    for (const campo of Object.keys(dados)) if (!["nome", "crm", "especialidade"].includes(campo)) delete dados[campo];
    const validado = new Medico(dados.nome ?? atual.nome, dados.crm ?? atual.crm, dados.especialidade ?? atual.especialidade);
    validado.validar();
    const alterou = await repo.atualizar(id, dados);
    return res.status(200).json({ mensagem: alterou ? "Médico atualizado." : "Nenhum campo enviado para atualização." });
  } catch (e) { return erro(res, e); }
}
export async function excluir(req, res) {
  try {
    const id = Medico.validarId(req.params.id);
    if (!await repo.deletar(id)) return res.status(404).json({ mensagem: "Médico não encontrado." });
    return res.status(200).json({ mensagem: "Médico excluído. Consultas vinculadas foram mantidas." });
  } catch { return res.status(500).json({ mensagem: "Erro ao excluir médico." }); }
}