import pool from '../database/connection';
import { IAutor, Autor } from '../models/Autor';

export class AutorRepository {
  async buscarTodos(): Promise<Autor[]> {
    const resultado = await pool.query(
      'SELECT * FROM autores ORDER BY nome ASC'
    );
    return resultado.rows.map((row) => new Autor(row));
  }

  async buscarPorId(id: number): Promise<Autor | null> {
    const resultado = await pool.query(
      'SELECT * FROM autores WHERE id = $1',
      [id]
    );
    if (resultado.rows.length === 0) return null;
    return new Autor(resultado.rows[0]);
  }

  async buscarPorEmail(email: string): Promise<Autor | null> {
    const resultado = await pool.query(
      'SELECT * FROM autores WHERE email = $1',
      [email]
    );
    if (resultado.rows.length === 0) return null;
    return new Autor(resultado.rows[0]);
  }

  async criar(autor: IAutor): Promise<Autor> {
    const resultado = await pool.query(
      `INSERT INTO autores (nome, email, nacionalidade)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [autor.nome, autor.email || null, autor.nacionalidade || null]
    );
    return new Autor(resultado.rows[0]);
  }

  async atualizar(id: number, dados: Partial<IAutor>): Promise<Autor | null> {
    const resultado = await pool.query(
      `UPDATE autores
       SET nome = $1, email = $2, nacionalidade = $3
       WHERE id = $4
       RETURNING *`,
      [dados.nome, dados.email || null, dados.nacionalidade || null, id]
    );
    if (resultado.rows.length === 0) return null;
    return new Autor(resultado.rows[0]);
  }

  async remover(id: number): Promise<boolean> {
    const resultado = await pool.query(
      'DELETE FROM autores WHERE id = $1',
      [id]
    );
    return (resultado.rowCount ?? 0) > 0;
  }

  async possuiLivros(id: number): Promise<boolean> {
    const resultado = await pool.query(
      'SELECT COUNT(*) FROM livros WHERE autor_id = $1',
      [id]
    );
    return parseInt(resultado.rows[0].count, 10) > 0;
  }
}
