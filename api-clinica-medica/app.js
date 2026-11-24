import express from "express";
import dotenv from "dotenv";
import { conexao } from "./config/conexao.js";
import medicoRoutes from "./routes/medicoRoutes.js";
import pacienteRoutes from "./routes/pacienteRoutes.js";
import consultaRoutes from "./routes/consultaRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ mensagem: "API Clínica Médica está funcionando." });
});

app.use("/medico", medicoRoutes);
app.use("/paciente", pacienteRoutes);
app.use("/consulta", consultaRoutes);

app.use((req, res) => res.status(404).json({ mensagem: "Rota não encontrada." }));

const PORT = process.env.PORT || 3000;
try {
  await conexao.ping();
  app.listen(PORT, () => console.log(`Servidor executando em http://localhost:${PORT}`));
} catch (erro) {
  console.error("Não foi possível conectar ao MySQL:", erro.message);
  process.exit(1);
}