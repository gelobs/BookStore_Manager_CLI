import { EmprestimoRepository } from '../repositories/EmprestimoRepository';
import { LivroRepository } from '../repositories/LivroRepository';
import { ClienteRepository } from '../repositories/ClienteRepository';
import { Emprestimo } from '../models/Emprestimo';

export class EmprestimoService {
  private readonly repository: EmprestimoRepository;
  private readonly livroRepository: LivroRepository;
  private readonly clienteRepository: ClienteRepository;

  constructor() {
    this.repository = new EmprestimoRepository();
    this.livroRepository = new LivroRepository();
    this.clienteRepository = new ClienteRepository();
  }

  async listarTodos(): Promise<Emprestimo[]> {
    return await this.repository.buscarTodos();
  }

  async buscarPorId(id: number): Promise<Emprestimo> {
    const emprestimo = await this.repository.buscarPorId(id);
    if (!emprestimo) {
      throw new Error(`Empréstimo com ID ${id} não encontrado.`);
    }
    return emprestimo;
  }

  async realizarEmprestimo(livroId: number, clienteId: number): Promise<Emprestimo> {
    // Valida existência do livro
    const livro = await this.livroRepository.buscarPorId(livroId);
    if (!livro) {
      throw new Error(`Livro com ID ${livroId} não encontrado.`);
    }

    // Valida existência do cliente
    const cliente = await this.clienteRepository.buscarPorId(clienteId);
    if (!cliente) {
      throw new Error(`Cliente com ID ${clienteId} não encontrado.`);
    }

    // Valida disponibilidade do livro
    if (!livro.estaDisponivel()) {
      throw new Error(
        `O livro "${livro.titulo}" não possui exemplares disponíveis no momento.`
      );
    }

    // Valida empréstimo duplicado
    const ativo = await this.repository.buscarAtivoPorClienteELivro(clienteId, livroId);
    if (ativo) {
      throw new Error(
        `O cliente "${cliente.nome}" já possui um empréstimo ativo deste livro.`
      );
    }

    // Cria o empréstimo e decrementa disponibilidade
    const emprestimo = await this.repository.criar({ livro_id: livroId, cliente_id: clienteId });
    await this.livroRepository.atualizarQuantidadeDisponivel(livroId, -1);

    return emprestimo;
  }

  async registrarDevolucao(emprestimoId: number): Promise<Emprestimo> {
    const emprestimo = await this.repository.buscarPorId(emprestimoId);
    if (!emprestimo) {
      throw new Error(`Empréstimo com ID ${emprestimoId} não encontrado.`);
    }
    if (emprestimo.devolvido) {
      throw new Error(`Este empréstimo já foi devolvido.`);
    }

    const devolvido = await this.repository.registrarDevolucao(emprestimoId);
    if (!devolvido) {
      throw new Error('Não foi possível registrar a devolução.');
    }

    // Incrementa disponibilidade do livro
    await this.livroRepository.atualizarQuantidadeDisponivel(emprestimo.livro_id, 1);

    return devolvido;
  }
}
