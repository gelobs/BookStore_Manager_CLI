import pool from '../database/connection';
import { ICliente, Cliente } from '../models/Cliente';

export class ClienteRepository {
  async buscarTodos(): Promise<Cliente[]> {
    const resultado = await pool.query(
      'SELECT * FROM clientes ORDER BY nome ASC'
    );
    return resultado.rows.map((row) => new Cliente(row));
  }

  async buscarPorId(id: number): Promise<Cliente | null> {
    const resultado = await pool.query(
      'SELECT * FROM clientes WHERE id = $1',
      [id]
    );
    if (resultado.rows.length === 0) return null;
    return new Cliente(resultado.rows[0]);
  }

  async buscarPorEmail(email: string): Promise<Cliente | null> {
    const resultado = await pool.query(
      'SELECT * FROM clientes WHERE email = $1',
      [email]
    );
    if (resultado.rows.length === 0) return null;
    return new Cliente(resultado.rows[0]);
  }

  async criar(cliente: ICliente): Promise<Cliente> {
    const resultado = await pool.query(
      `INSERT INTO clientes (nome, email, telefone)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [cliente.nome, cliente.email, cliente.telefone || null]
    );
    return new Cliente(resultado.rows[0]);
  }

  async atualizar(id: number, dados: Partial<ICliente>): Promise<Cliente | null> {
    const resultado = await pool.query(
      `UPDATE clientes
       SET nome = $1, email = $2, telefone = $3
       WHERE id = $4
       RETURNING *`,
      [dados.nome, dados.email, dados.telefone || null, id]
    );
    if (resultado.rows.length === 0) return null;
    return new Cliente(resultado.rows[0]);
  }

  async remover(id: number): Promise<boolean> {
    const resultado = await pool.query(
      'DELETE FROM clientes WHERE id = $1',
      [id]
    );
    return (resultado.rowCount ?? 0) > 0;
  }

  async possuiEmprestimosAtivos(id: number): Promise<boolean> {
    const resultado = await pool.query(
      'SELECT COUNT(*) FROM emprestimos WHERE cliente_id = $1 AND devolvido = FALSE',
      [id]
    );
    return parseInt(resultado.rows[0].count, 10) > 0;
  }
}
