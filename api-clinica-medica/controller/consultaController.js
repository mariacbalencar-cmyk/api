import { Consulta } from "../model/Consulta.js";
import { Medico } from "../model/Medico.js";
import { Paciente } from "../model/Paciente.js";
import * as consultaRepo from "../repository/consultaRepository.js";
import * as medicoRepo from "../repository/medicoRepository.js";
import * as pacienteRepo from "../repository/pacienteRepository.js";

function erro(res, e) { return res.status(400).json({ mensagem: e.message || "Dados inválidos." }); }

export async function cadastrar(req, res) {
  try {
    const consulta = new Consulta(req.body.data_hora, req.body.motivo, req.body.status ?? "rascunho");
    consulta.validar();
    const id = await consultaRepo.adicionar(consulta);
    return res.status(201).json({ mensagem: "Consulta cadastrada sem vínculos.", id_consulta: id });
  } catch (e) { return erro(res, e); }
}
export async function listar(req, res) {
  try { return res.status(200).json(await consultaRepo.listar()); }
  catch { return res.status(500).json({ mensagem: "Erro ao listar consultas." }); }
}
export async function buscarPorId(req, res) {
  try {
    const id = Consulta.validarId(req.params.id);
    const consulta = await consultaRepo.buscarPorId(id);
    if (!consulta) return res.status(404).json({ mensagem: "Consulta não encontrada." });
    return res.status(200).json(consulta);
  } catch (e) { return erro(res, e); }
}
export async function atualizar(req, res) {
  try {
    const id = Consulta.validarId(req.params.id);
    const atual = await consultaRepo.buscarPorId(id);
    if (!atual) return res.status(404).json({ mensagem: "Consulta não encontrada." });
    const dados = { ...req.body };
    for (const campo of Object.keys(dados)) if (!["data_hora", "motivo", "status"].includes(campo)) delete dados[campo];
    const dataAtual = String(atual.data_hora).replace("T", " ").slice(0, 19);
    const validado = new Consulta(dados.data_hora ?? dataAtual, dados.motivo ?? atual.motivo, dados.status ?? atual.status);
    validado.validar();
    const alterou = await consultaRepo.atualizar(id, dados);
    return res.status(200).json({ mensagem: alterou ? "Consulta atualizada." : "Nenhum campo enviado para atualização." });
  } catch (e) { return erro(res, e); }
}
export async function excluir(req, res) {
  try {
    const id = Consulta.validarId(req.params.id);
    if (!await consultaRepo.deletar(id)) return res.status(404).json({ mensagem: "Consulta não encontrada." });
    return res.status(200).json({ mensagem: "Consulta excluída." });
  } catch { return res.status(500).json({ mensagem: "Erro ao excluir consulta." }); }
}
export async function vincularMedico(req, res) {
  try {
    const idConsulta = Consulta.validarId(req.params.idConsulta);
    const idMedico = Medico.validarId(req.params.idMedico);
    if (!await consultaRepo.buscarPorId(idConsulta)) return res.status(404).json({ mensagem: "Consulta não encontrada." });
    if (!await medicoRepo.buscarPorId(idMedico)) return res.status(404).json({ mensagem: "Médico não encontrado." });
    await consultaRepo.vincularMedico(idConsulta, idMedico);
    return res.status(200).json({ mensagem: "Médico vinculado à consulta." });
  } catch (e) { return erro(res, e); }
}
export async function removerMedico(req, res) {
  try {
    const id = Consulta.validarId(req.params.idConsulta);
    if (!await consultaRepo.buscarPorId(id)) return res.status(404).json({ mensagem: "Consulta não encontrada." });
    await consultaRepo.removerMedico(id);
    return res.status(200).json({ mensagem: "Vínculo com médico removido. Consulta e médico foram mantidos." });
  } catch (e) { return erro(res, e); }
}
export async function vincularPaciente(req, res) {
  try {
    const idConsulta = Consulta.validarId(req.params.idConsulta);
    const idPaciente = Paciente.validarId(req.params.idPaciente);
    if (!await consultaRepo.buscarPorId(idConsulta)) return res.status(404).json({ mensagem: "Consulta não encontrada." });
    if (!await pacienteRepo.buscarPorId(idPaciente)) return res.status(404).json({ mensagem: "Paciente não encontrado." });
    await consultaRepo.vincularPaciente(idConsulta, idPaciente);
    return res.status(200).json({ mensagem: "Paciente vinculado à consulta." });
  } catch (e) { return erro(res, e); }
}
export async function removerPaciente(req, res) {
  try {
    const id = Consulta.validarId(req.params.idConsulta);
    if (!await consultaRepo.buscarPorId(id)) return res.status(404).json({ mensagem: "Consulta não encontrada." });
    await consultaRepo.removerPaciente(id);
    return res.status(200).json({ mensagem: "Vínculo com paciente removido. Consulta e paciente foram mantidos." });
  } catch (e) { return erro(res, e); }
}