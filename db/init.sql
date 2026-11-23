-- Schema do módulo Ouvidoria e Vizinhança de Obra.
-- Implementa o DER da Unidade 2 (docs/diagramas/02_der_ouvidoria.png), em 3FN.
-- Issue #15 — decisão de modelagem da persistência.
-- O status atual NÃO é armazenado: é derivado do último evento de log_historico (vw_reclamacao_atual).

CREATE TABLE usuario (
  id_usuario SERIAL PRIMARY KEY,
  nome       TEXT NOT NULL,
  email      TEXT NOT NULL UNIQUE,
  perfil     TEXT NOT NULL DEFAULT 'morador' CHECK (perfil IN ('morador','atendente')),
  criado_em  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE categoria (
  id_categoria TEXT PRIMARY KEY,
  nome         TEXT NOT NULL UNIQUE,
  ativa        BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE status (
  id_status TEXT PRIMARY KEY,
  nome      TEXT NOT NULL UNIQUE,
  ordem     INT NOT NULL
);

CREATE TABLE obra (
  id_obra     SERIAL PRIMARY KEY,
  nome        TEXT NOT NULL,
  construtora TEXT,
  endereco    TEXT
);

CREATE SEQUENCE protocolo_seq;

CREATE TABLE reclamacao (
  id_reclamacao SERIAL PRIMARY KEY,
  protocolo     TEXT NOT NULL UNIQUE,
  id_usuario    INT  NOT NULL REFERENCES usuario(id_usuario),
  id_categoria  TEXT NOT NULL REFERENCES categoria(id_categoria),
  id_obra       INT  REFERENCES obra(id_obra),
  tipo          TEXT NOT NULL CHECK (tipo IN ('obra','vizinhanca')),
  descricao     TEXT NOT NULL CHECK (length(descricao) BETWEEN 10 AND 500),
  ocorrido_em   TIMESTAMPTZ,
  frequencia    TEXT NOT NULL DEFAULT 'primeira' CHECK (frequencia IN ('primeira','alguns_dias','todo_dia')),
  anonima       BOOLEAN NOT NULL DEFAULT false,
  endereco      TEXT NOT NULL CHECK (length(trim(endereco)) > 0),
  latitude      DOUBLE PRECISION,
  longitude     DOUBLE PRECISION,
  referencia    TEXT,
  prioridade    TEXT NOT NULL DEFAULT 'Média' CHECK (prioridade IN ('Alta','Média','Baixa')),
  criada_em     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE midia (
  id_midia      SERIAL PRIMARY KEY,
  id_reclamacao INT NOT NULL REFERENCES reclamacao(id_reclamacao),
  tipo          TEXT NOT NULL CHECK (tipo IN ('foto','video')),
  uri           TEXT NOT NULL
);

CREATE TABLE log_historico (
  id_evento        SERIAL PRIMARY KEY,
  id_reclamacao    INT  NOT NULL REFERENCES reclamacao(id_reclamacao),
  id_status        TEXT NOT NULL REFERENCES status(id_status),
  id_usuario       INT  NOT NULL REFERENCES usuario(id_usuario),
  descricao_evento TEXT NOT NULL,
  resposta_cidadao TEXT,
  ocorrido_em      TIMESTAMPTZ NOT NULL DEFAULT now(),
  hash_anterior    TEXT NOT NULL,
  hash_evento      TEXT NOT NULL
);

CREATE INDEX idx_log_reclamacao ON log_historico(id_reclamacao, id_evento);
CREATE INDEX idx_reclamacao_usuario ON reclamacao(id_usuario);

CREATE VIEW vw_reclamacao_atual AS
SELECT r.id_reclamacao, r.protocolo, r.id_usuario, u.nome AS usuario_nome,
       r.id_categoria, c.nome AS categoria_nome, r.id_obra, r.tipo, r.descricao,
       r.ocorrido_em, r.frequencia, r.anonima, r.endereco, r.latitude, r.longitude,
       r.referencia, r.prioridade, r.criada_em,
       l.id_status, s.nome AS status_nome, l.ocorrido_em AS atualizada_em
FROM reclamacao r
JOIN usuario u   ON u.id_usuario = r.id_usuario
JOIN categoria c ON c.id_categoria = r.id_categoria
JOIN LATERAL (
  SELECT * FROM log_historico lh
  WHERE lh.id_reclamacao = r.id_reclamacao
  ORDER BY lh.id_evento DESC LIMIT 1
) l ON true
JOIN status s ON s.id_status = l.id_status;
