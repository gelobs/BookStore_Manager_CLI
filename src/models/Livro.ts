export interface ILivro {
  id?: number;
  titulo: string;
  isbn?: string;
  ano_publicacao?: number;
  quantidade_total: number;
  quantidade_disponivel: number;
  autor_id: number;
  criado_em?: Date;
  // Campo de JOIN
  autor_nome?: string;
}

export class Livro implements ILivro {
  public id?: number;
  public titulo: string;
  public isbn?: string;
  public ano_publicacao?: number;
  public quantidade_total: number;
  public quantidade_disponivel: number;
  public autor_id: number;
  public criado_em?: Date;
  public autor_nome?: string;

  constructor(data: ILivro) {
    this.id = data.id;
    this.titulo = data.titulo;
    this.isbn = data.isbn;
    this.ano_publicacao = data.ano_publicacao;
    this.quantidade_total = data.quantidade_total;
    this.quantidade_disponivel = data.quantidade_disponivel;
    this.autor_id = data.autor_id;
    this.criado_em = data.criado_em;
    this.autor_nome = data.autor_nome;
  }

  public estaDisponivel(): boolean {
    return this.quantidade_disponivel > 0;
  }

  public toString(): string {
    return (
      `[${this.id}] ${this.titulo}` +
      ` | Autor: ${this.autor_nome || this.autor_id}` +
      ` | ISBN: ${this.isbn || 'N/A'}` +
      ` | Ano: ${this.ano_publicacao || 'N/A'}` +
      ` | Disponível: ${this.quantidade_disponivel}/${this.quantidade_total}`
    );
  }
}
