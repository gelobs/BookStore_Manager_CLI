import { LivroRepository } from '../repositories/LivroRepository';
import { AutorRepository } from '../repositories/AutorRepository';
import { ILivro, Livro } from '../models/Livro';

export class LivroService {
  private readonly repository: LivroRepository;
  private readonly autorRepository: AutorRepository;

  constructor() {
    this.repository = new LivroRepository();
    this.autorRepository = new AutorRepository();
  }

  async listarTodos(): Promise<Livro[]> {
    return await this.repository.buscarTodos();
  }

  async buscarPorId(id: number): Promise<Livro> {
    const livro = await this.repository.buscarPorId(id);
    if (!livro) {
      throw new Error(`Livro com ID ${id} não encontrado.`);
    }
    return livro;
  }

  async cadastrar(dados: ILivro): Promise<Livro> {
    if (!dados.titulo || dados.titulo.trim() === '') {
      throw new Error('O título do livro é obrigatório.');
    }
    if (!dados.quantidade_total || dados.quantidade_total < 1) {
      throw new Error('A quantidade deve ser pelo menos 1.');
    }

    const autor = await this.autorRepository.buscarPorId(dados.autor_id);
    if (!autor) {
      throw new Error(`Autor com ID ${dados.autor_id} não encontrado.`);
    }

    if (dados.isbn) {
      const existente = await this.repository.buscarPorIsbn(dados.isbn);
      if (existente) {
        throw new Error(`Já existe um livro cadastrado com o ISBN "${dados.isbn}".`);
      }
    }

    return await this.repository.criar(dados);
  }

  async atualizar(id: number, dados: Partial<ILivro>): Promise<Livro> {
    const livroAtual = await this.repository.buscarPorId(id);
    if (!livroAtual) {
      throw new Error(`Livro com ID ${id} não encontrado.`);
    }
    if (!dados.titulo || dados.titulo.trim() === '') {
      throw new Error('O título do livro é obrigatório.');
    }
    if (dados.autor_id) {
      const autor = await this.autorRepository.buscarPorId(dados.autor_id);
      if (!autor) {
        throw new Error(`Autor com ID ${dados.autor_id} não encontrado.`);
      }
    }
    if (dados.isbn && dados.isbn !== livroAtual.isbn) {
      const comMesmoIsbn = await this.repository.buscarPorIsbn(dados.isbn);
      if (comMesmoIsbn) {
        throw new Error(`Já existe um livro cadastrado com o ISBN "${dados.isbn}".`);
      }
    }

    const atualizado = await this.repository.atualizar(id, dados);
    if (!atualizado) {
      throw new Error('Não foi possível atualizar o livro.');
    }
    return atualizado;
  }

  async remover(id: number): Promise<void> {
    const livro = await this.repository.buscarPorId(id);
    if (!livro) {
      throw new Error(`Livro com ID ${id} não encontrado.`);
    }

    const temEmprestimosAtivos = await this.repository.possuiEmprestimosAtivos(id);
    if (temEmprestimosAtivos) {
      throw new Error(
        'Não é possível remover este livro pois ele possui empréstimos ativos.'
      );
    }

    const temHistorico = await this.repository.possuiEmprestimos(id);
    if (temHistorico) {
      throw new Error(
        'Não é possível remover este livro pois ele possui histórico de empréstimos. ' +
        'A remoção quebraria o registro de empréstimos anteriores.'
      );
    }

    await this.repository.remover(id);
  }
}