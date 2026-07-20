import pool from '../database/connection';
import { IEmprestimo, Emprestimo } from '../models/Emprestimo';

export class EmprestimoRepository {
  async buscarTodos(): Promise<Emprestimo[]> {
    const resultado = await pool.query(
      `SELECT e.*,
              l.titulo AS livro_titulo,
              c.nome   AS cliente_nome
       FROM emprestimos e
       INNER JOIN livros   l ON e.livro_id   = l.id
       INNER JOIN clientes c ON e.cliente_id = c.id
       ORDER BY e.data_emprestimo DESC`
    );
    return resultado.rows.map((row) => new Emprestimo(row));
  }

  async buscarPorId(id: number): Promise<Emprestimo | null> {
    const resultado = await pool.query(
      `SELECT e.*,
              l.titulo AS livro_titulo,
              c.nome   AS cliente_nome
       FROM emprestimos e
       INNER JOIN livros   l ON e.livro_id   = l.id
       INNER JOIN clientes c ON e.cliente_id = c.id
       WHERE e.id = $1`,
      [id]
    );
    if (resultado.rows.length === 0) return null;
    return new Emprestimo(resultado.rows[0]);
  }

  async buscarAtivoPorClienteELivro(
    clienteId: number,
    livroId: number
  ): Promise<Emprestimo | null> {
    const resultado = await pool.query(
      `SELECT * FROM emprestimos
       WHERE cliente_id = $1 AND livro_id = $2 AND devolvido = FALSE`,
      [clienteId, livroId]
    );
    if (resultado.rows.length === 0) return null;
    return new Emprestimo(resultado.rows[0]);
  }

  async criar(emprestimo: IEmprestimo): Promise<Emprestimo> {
    const resultado = await pool.query(
      `INSERT INTO emprestimos (livro_id, cliente_id)
       VALUES ($1, $2)
       RETURNING *`,
      [emprestimo.livro_id, emprestimo.cliente_id]
    );
    return new Emprestimo(resultado.rows[0]);
  }

  async registrarDevolucao(id: number): Promise<Emprestimo | null> {
    const resultado = await pool.query(
      `UPDATE emprestimos
       SET devolvido = TRUE, data_devolucao = NOW()
       WHERE id = $1
       RETURNING *`,
      [id]
    );
    if (resultado.rows.length === 0) return null;
    return new Emprestimo(resultado.rows[0]);
  }

  // ----------------------------------------------------------------
  // Consultas relacionais para Relatórios (RF17)
  // ----------------------------------------------------------------

  async relatorioLivrosDisponiveis(): Promise<
    { titulo: string; autor: string; disponiveis: number; total: number }[]
  > {
    const resultado = await pool.query(
      `SELECT l.titulo,
              a.nome              AS autor,
              l.quantidade_disponivel AS disponiveis,
              l.quantidade_total  AS total
       FROM livros l
       INNER JOIN autores a ON l.autor_id = a.id
       WHERE l.quantidade_disponivel > 0
       ORDER BY l.titulo ASC`
    );
    return resultado.rows;
  }

  async relatorioLivrosEmprestados(): Promise<
    { titulo: string; autor: string; emprestimos_ativos: number }[]
  > {
    const resultado = await pool.query(
      `SELECT l.titulo,
              a.nome        AS autor,
              COUNT(e.id)   AS emprestimos_ativos
       FROM emprestimos e
       INNER JOIN livros   l ON e.livro_id  = l.id
       INNER JOIN autores  a ON l.autor_id  = a.id
       WHERE e.devolvido = FALSE
       GROUP BY l.id, l.titulo, a.nome
       ORDER BY emprestimos_ativos DESC`
    );
    return resultado.rows;
  }

  async relatorioLivrosPorAutor(): Promise<
    { autor: string; total_livros: number }[]
  > {
    const resultado = await pool.query(
      `SELECT a.nome       AS autor,
              COUNT(l.id)  AS total_livros
       FROM autores a
       LEFT JOIN livros l ON l.autor_id = a.id
       GROUP BY a.id, a.nome
       ORDER BY total_livros DESC, a.nome ASC`
    );
    return resultado.rows;
  }

  async relatorioEmprestimosPorLivro(): Promise<
    { titulo: string; total_emprestimos: number }[]
  > {
    const resultado = await pool.query(
      `SELECT l.titulo,
              COUNT(e.id) AS total_emprestimos
       FROM livros l
       LEFT JOIN emprestimos e ON e.livro_id = l.id
       GROUP BY l.id, l.titulo
       ORDER BY total_emprestimos DESC
       LIMIT 10`
    );
    return resultado.rows;
  }

  async relatorioClientesComEmprestimosAtivos(): Promise<
    { cliente: string; email: string; emprestimos_ativos: number }[]
  > {
    const resultado = await pool.query(
      `SELECT c.nome        AS cliente,
              c.email,
              COUNT(e.id)   AS emprestimos_ativos
       FROM clientes c
       INNER JOIN emprestimos e ON e.cliente_id = c.id
       WHERE e.devolvido = FALSE
       GROUP BY c.id, c.nome, c.email
       ORDER BY emprestimos_ativos DESC`
    );
    return resultado.rows;
  }
}
