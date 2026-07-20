import pool from '../database/connection';
import { ILivro, Livro } from '../models/Livro';

export class LivroRepository {
  async buscarTodos(): Promise<Livro[]> {
    const resultado = await pool.query(
      `SELECT l.*, a.nome AS autor_nome
       FROM livros l
       INNER JOIN autores a ON l.autor_id = a.id
       ORDER BY l.titulo ASC`
    );
    return resultado.rows.map((row) => new Livro(row));
  }

  async buscarPorId(id: number): Promise<Livro | null> {
    const resultado = await pool.query(
      `SELECT l.*, a.nome AS autor_nome
       FROM livros l
       INNER JOIN autores a ON l.autor_id = a.id
       WHERE l.id = $1`,
      [id]
    );
    if (resultado.rows.length === 0) return null;
    return new Livro(resultado.rows[0]);
  }

  async buscarPorIsbn(isbn: string): Promise<Livro | null> {
    const resultado = await pool.query(
      'SELECT * FROM livros WHERE isbn = $1',
      [isbn]
    );
    if (resultado.rows.length === 0) return null;
    return new Livro(resultado.rows[0]);
  }

  async criar(livro: ILivro): Promise<Livro> {
    const resultado = await pool.query(
      `INSERT INTO livros
         (titulo, isbn, ano_publicacao, quantidade_total, quantidade_disponivel, autor_id)
       VALUES ($1, $2, $3, $4, $4, $5)
       RETURNING *`,
      [
        livro.titulo,
        livro.isbn || null,
        livro.ano_publicacao || null,
        livro.quantidade_total,
        livro.autor_id,
      ]
    );
    return new Livro(resultado.rows[0]);
  }

  async atualizar(id: number, dados: Partial<ILivro>): Promise<Livro | null> {
    const resultado = await pool.query(
      `UPDATE livros
       SET titulo = $1, isbn = $2, ano_publicacao = $3,
           quantidade_total = $4, autor_id = $5
       WHERE id = $6
       RETURNING *`,
      [
        dados.titulo,
        dados.isbn || null,
        dados.ano_publicacao || null,
        dados.quantidade_total,
        dados.autor_id,
        id,
      ]
    );
    if (resultado.rows.length === 0) return null;
    return new Livro(resultado.rows[0]);
  }

  async atualizarQuantidadeDisponivel(
    id: number,
    delta: number
  ): Promise<void> {
    await pool.query(
      `UPDATE livros
       SET quantidade_disponivel = quantidade_disponivel + $1
       WHERE id = $2`,
      [delta, id]
    );
  }

  async remover(id: number): Promise<boolean> {
    const resultado = await pool.query(
      'DELETE FROM livros WHERE id = $1',
      [id]
    );
    return (resultado.rowCount ?? 0) > 0;
  }

  async possuiEmprestimosAtivos(id: number): Promise<boolean> {
    const resultado = await pool.query(
      'SELECT COUNT(*) FROM emprestimos WHERE livro_id = $1 AND devolvido = FALSE',
      [id]
    );
    return parseInt(resultado.rows[0].count, 10) > 0;
  }

  async possuiEmprestimos(id: number): Promise<boolean> {
    const resultado = await pool.query(
      'SELECT COUNT(*) FROM emprestimos WHERE livro_id = $1',
      [id]
    );
    return parseInt(resultado.rows[0].count, 10) > 0;
  }

  async removerHistoricoDeEmprestimos(id: number): Promise<void> {
    await pool.query(
      'DELETE FROM emprestimos WHERE livro_id = $1',
      [id]
    );
  }
}