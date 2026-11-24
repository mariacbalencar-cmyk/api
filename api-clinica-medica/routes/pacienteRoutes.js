import { Router } from "express";
import * as controller from "../controller/pacienteController.js";
const router = Router();
router.post("/", controller.cadastrar);
router.get("/", controller.listar);
router.get("/:id", controller.buscarPorId);
router.patch("/:id", controller.atualizar);
router.delete("/:id", controller.excluir);
export default router;