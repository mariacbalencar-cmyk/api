CREATE DATABASE IF NOT EXISTS clinica_medica
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE clinica_medica;

CREATE TABLE IF NOT EXISTS medico (
  id_medico INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  crm VARCHAR(30) NOT NULL UNIQUE,
  especialidade VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS paciente (
  id_paciente INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  cpf CHAR(11) NOT NULL UNIQUE,
  data_nascimento DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS consulta (
  id_consulta INT AUTO_INCREMENT PRIMARY KEY,
  data_hora DATETIME NOT NULL,
  motivo VARCHAR(255) NOT NULL,
  status ENUM('rascunho', 'agendada', 'concluida', 'cancelada') NOT NULL DEFAULT 'rascunho',
  fk_id_medico INT NULL,
  fk_id_paciente INT NULL,
  CONSTRAINT fk_consulta_medico FOREIGN KEY (fk_id_medico)
    REFERENCES medico(id_medico)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_consulta_paciente FOREIGN KEY (fk_id_paciente)
    REFERENCES paciente(id_paciente)
    ON DELETE SET NULL ON UPDATE CASCADE
);

-- Cadastros iniciais para testes (execute uma única vez).
INSERT INTO medico (nome, crm, especialidade) VALUES
('Ana Souza', 'CRM10001', 'Cardiologia'),
('Bruno Lima', 'CRM10002', 'Dermatologia'),
('Carla Mendes', 'CRM10003', 'Pediatria');

INSERT INTO paciente (nome, cpf, data_nascimento) VALUES
('João Silva', '11122233344', '1990-05-10'),
('Maria Oliveira', '22233344455', '1985-09-21'),
('Pedro Santos', '33344455566', '2000-02-15');

INSERT INTO consulta (data_hora, motivo, status) VALUES
('2026-12-01 09:00:00', 'Consulta de rotina', 'agendada'),
('2026-12-01 10:00:00', 'Avaliação dermatológica', 'rascunho'),
('2026-12-02 11:30:00', 'Retorno pediátrico', 'agendada'),
('2026-12-03 14:00:00', 'Avaliação cardíaca', 'agendada'),
('2026-12-04 08:30:00', 'Acompanhamento anual', 'concluida');