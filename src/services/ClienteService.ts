import { ClienteRepository } from '../repositories/ClienteRepository';
import { ICliente, Cliente } from '../models/Cliente';

export class ClienteService {
  private readonly repository: ClienteRepository;

  constructor() {
    this.repository = new ClienteRepository();
  }

  async listarTodos(): Promise<Cliente[]> {
    return await this.repository.buscarTodos();
  }

  async buscarPorId(id: number): Promise<Cliente> {
    const cliente = await this.repository.buscarPorId(id);
    if (!cliente) {
      throw new Error(`Cliente com ID ${id} não encontrado.`);
    }
    return cliente;
  }

  async cadastrar(dados: ICliente): Promise<Cliente> {
    if (!dados.nome || dados.nome.trim() === '') {
      throw new Error('O nome do cliente é obrigatório.');
    }
    if (!dados.email || dados.email.trim() === '') {
      throw new Error('O e-mail do cliente é obrigatório.');
    }

    const existente = await this.repository.buscarPorEmail(dados.email);
    if (existente) {
      throw new Error(`Já existe um cliente cadastrado com o e-mail "${dados.email}".`);
    }

    return await this.repository.criar(dados);
  }

  async atualizar(id: number, dados: Partial<ICliente>): Promise<Cliente> {
    const clienteAtual = await this.repository.buscarPorId(id);
    if (!clienteAtual) {
      throw new Error(`Cliente com ID ${id} não encontrado.`);
    }
    if (!dados.nome || dados.nome.trim() === '') {
      throw new Error('O nome do cliente é obrigatório.');
    }
    if (!dados.email || dados.email.trim() === '') {
      throw new Error('O e-mail do cliente é obrigatório.');
    }
    if (dados.email !== clienteAtual.email) {
      const comMesmoEmail = await this.repository.buscarPorEmail(dados.email);
      if (comMesmoEmail) {
        throw new Error(`Já existe um cliente com o e-mail "${dados.email}".`);
      }
    }

    const atualizado = await this.repository.atualizar(id, dados);
    if (!atualizado) {
      throw new Error('Não foi possível atualizar o cliente.');
    }
    return atualizado;
  }

  async remover(id: number): Promise<void> {
    const cliente = await this.repository.buscarPorId(id);
    if (!cliente) {
      throw new Error(`Cliente com ID ${id} não encontrado.`);
    }
    const temEmprestimos = await this.repository.possuiEmprestimosAtivos(id);
    if (temEmprestimos) {
      throw new Error(
        'Não é possível remover este cliente pois ele possui empréstimos ativos.'
      );
    }
    await this.repository.remover(id);
  }
}
