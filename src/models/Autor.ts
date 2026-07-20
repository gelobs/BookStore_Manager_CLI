export interface IAutor {
  id?: number;
  nome: string;
  email?: string;
  nacionalidade?: string;
  criado_em?: Date;
}

export class Autor implements IAutor {
  public id?: number;
  public nome: string;
  public email?: string;
  public nacionalidade?: string;
  public criado_em?: Date;

  constructor(data: IAutor) {
    this.id = data.id;
    this.nome = data.nome;
    this.email = data.email;
    this.nacionalidade = data.nacionalidade;
    this.criado_em = data.criado_em;
  }

  public toString(): string {
    return (
      `[${this.id}] ${this.nome}` +
      ` | Nacionalidade: ${this.nacionalidade || 'N/A'}` +
      ` | E-mail: ${this.email || 'N/A'}`
    );
  }
}
