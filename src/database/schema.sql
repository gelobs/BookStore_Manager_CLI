-- Tabela de Autores
CREATE TABLE IF NOT EXISTS autores (
  id            SERIAL PRIMARY KEY,
  nome          VARCHAR(100) NOT NULL,
  email         VARCHAR(100) UNIQUE,
  nacionalidade VARCHAR(50),
  criado_em     TIMESTAMP DEFAULT NOW()
);

-- Tabela de Livros
CREATE TABLE IF NOT EXISTS livros (
  id                    SERIAL PRIMARY KEY,
  titulo                VARCHAR(200) NOT NULL,
  isbn                  VARCHAR(20) UNIQUE,
  ano_publicacao        INTEGER,
  quantidade_total      INTEGER NOT NULL DEFAULT 1,
  quantidade_disponivel INTEGER NOT NULL DEFAULT 1,
  autor_id              INTEGER NOT NULL REFERENCES autores(id) ON DELETE RESTRICT,
  criado_em             TIMESTAMP DEFAULT NOW()
);

-- Tabela de Clientes
CREATE TABLE IF NOT EXISTS clientes (
  id        SERIAL PRIMARY KEY,
  nome      VARCHAR(100) NOT NULL,
  email     VARCHAR(100) UNIQUE NOT NULL,
  telefone  VARCHAR(20),
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de Empréstimos
CREATE TABLE IF NOT EXISTS emprestimos (
  id               SERIAL PRIMARY KEY,
  livro_id         INTEGER NOT NULL REFERENCES livros(id) ON DELETE RESTRICT,
  cliente_id       INTEGER NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
  data_emprestimo  TIMESTAMP DEFAULT NOW(),
  data_devolucao   TIMESTAMP,
  devolvido        BOOLEAN DEFAULT FALSE,
  criado_em        TIMESTAMP DEFAULT NOW()
);
