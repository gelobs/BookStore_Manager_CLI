export interface IEmprestimo {
  id?: number;
  livro_id: number;
  cliente_id: number;
  data_emprestimo?: Date;
  data_devolucao?: Date | null;
  devolvido?: boolean;
  criado_em?: Date;
  // Campos de JOIN
  livro_titulo?: string;
  cliente_nome?: string;
}

export class Emprestimo implements IEmprestimo {
  public id?: number;
  public livro_id: number;
  public cliente_id: number;
  public data_emprestimo?: Date;
  public data_devolucao?: Date | null;
  public devolvido?: boolean;
  public criado_em?: Date;
  public livro_titulo?: string;
  public cliente_nome?: string;

  constructor(data: IEmprestimo) {
    this.id = data.id;
    this.livro_id = data.livro_id;
    this.cliente_id = data.cliente_id;
    this.data_emprestimo = data.data_emprestimo;
    this.data_devolucao = data.data_devolucao;
    this.devolvido = data.devolvido;
    this.criado_em = data.criado_em;
    this.livro_titulo = data.livro_titulo;
    this.cliente_nome = data.cliente_nome;
  }

  public getStatus(): string {
    return this.devolvido ? 'Devolvido' : 'Em andamento';
  }

  public toString(): string {
    const dataEmp = this.data_emprestimo
      ? new Date(this.data_emprestimo).toLocaleDateString('pt-BR')
      : 'N/A';
    const dataDev = this.data_devolucao
      ? new Date(this.data_devolucao).toLocaleDateString('pt-BR')
      : 'Pendente';

    return (
      `[${this.id}] Livro: ${this.livro_titulo || this.livro_id}` +
      ` | Cliente: ${this.cliente_nome || this.cliente_id}` +
      ` | Emprestado em: ${dataEmp}` +
      ` | Devolução: ${dataDev}` +
      ` | Status: ${this.getStatus()}`
    );
  }
}
