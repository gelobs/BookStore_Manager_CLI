import { AutorRepository } from '../repositories/AutorRepository';
import { IAutor, Autor } from '../models/Autor';

export class AutorService {
  private readonly repository: AutorRepository;

  constructor() {
    this.repository = new AutorRepository();
  }

  async listarTodos(): Promise<Autor[]> {
    return await this.repository.buscarTodos();
  }

  async buscarPorId(id: number): Promise<Autor> {
    const autor = await this.repository.buscarPorId(id);
    if (!autor) {
      throw new Error(`Autor com ID ${id} não encontrado.`);
    }
    return autor;
  }

  async cadastrar(dados: IAutor): Promise<Autor> {
    if (!dados.nome || dados.nome.trim() === '') {
      throw new Error('O nome do autor é obrigatório.');
    }

    if (dados.email) {
      const existente = await this.repository.buscarPorEmail(dados.email);
      if (existente) {
        throw new Error(`Já existe um autor cadastrado com o e-mail "${dados.email}".`);
      }
    }

    return await this.repository.criar(dados);
  }

  async atualizar(id: number, dados: Partial<IAutor>): Promise<Autor> {
    const autorExistente = await this.repository.buscarPorId(id);
    if (!autorExistente) {
      throw new Error(`Autor com ID ${id} não encontrado.`);
    }

    if (!dados.nome || dados.nome.trim() === '') {
      throw new Error('O nome do autor é obrigatório.');
    }

    if (dados.email && dados.email !== autorExistente.email) {
      const comMesmoEmail = await this.repository.buscarPorEmail(dados.email);
      if (comMesmoEmail) {
        throw new Error(`Já existe um autor cadastrado com o e-mail "${dados.email}".`);
      }
    }

    const atualizado = await this.repository.atualizar(id, dados);
    if (!atualizado) {
      throw new Error('Não foi possível atualizar o autor.');
    }
    return atualizado;
  }

  async remover(id: number): Promise<void> {
    const autor = await this.repository.buscarPorId(id);
    if (!autor) {
      throw new Error(`Autor com ID ${id} não encontrado.`);
    }

    const temLivros = await this.repository.possuiLivros(id);
    if (temLivros) {
      throw new Error(
        'Não é possível remover este autor pois ele possui livros cadastrados.'
      );
    }

    await this.repository.remover(id);
  }
}
