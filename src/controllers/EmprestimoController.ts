import { EmprestimoService } from '../services/EmprestimoService';
import { question, pressEnterToContinue } from '../utils/input';
import { printSucesso, printErro, printLista, printInfo } from '../utils/formatter';

export class EmprestimoController {
  private readonly service: EmprestimoService;

  constructor() {
    this.service = new EmprestimoService();
  }

  async realizarEmprestimo(): Promise<void> {
    console.log('\n--- Realizar Empréstimo ---');
    try {
      const livroIdStr = await question('ID do livro: ');
      const livroId = parseInt(livroIdStr, 10);
      if (isNaN(livroId)) throw new Error('ID do livro inválido.');

      const clienteIdStr = await question('ID do cliente: ');
      const clienteId = parseInt(clienteIdStr, 10);
      if (isNaN(clienteId)) throw new Error('ID do cliente inválido.');

      const emprestimo = await this.service.realizarEmprestimo(livroId, clienteId);
      printSucesso(
        `Empréstimo registrado com sucesso! ID do empréstimo: ${emprestimo.id}`
      );
    } catch (error) {
      printErro((error as Error).message);
    }
    await pressEnterToContinue();
  }

  async registrarDevolucao(): Promise<void> {
    console.log('\n--- Registrar Devolução ---');
    try {
      const idStr = await question('ID do empréstimo: ');
      const id = parseInt(idStr, 10);
      if (isNaN(id)) throw new Error('ID inválido.');

      const emprestimo = await this.service.buscarPorId(id);
      printInfo(`Empréstimo: ${emprestimo.toString()}`);

      const confirmacao = await question('Confirmar devolução? (s/N): ');
      if (confirmacao.toLowerCase() !== 's') {
        printInfo('Operação cancelada.');
      } else {
        const devolvido = await this.service.registrarDevolucao(id);
        printSucesso(
          `Devolução registrada com sucesso! Livro devolvido em: ${
            devolvido.data_devolucao
              ? new Date(devolvido.data_devolucao).toLocaleDateString('pt-BR')
              : 'N/A'
          }`
        );
      }
    } catch (error) {
      printErro((error as Error).message);
    }
    await pressEnterToContinue();
  }

  async listar(): Promise<void> {
    console.log('\n--- Consultar Empréstimos ---');
    try {
      const emprestimos = await this.service.listarTodos();
      printLista(emprestimos);
    } catch (error) {
      printErro((error as Error).message);
    }
    await pressEnterToContinue();
  }

  async buscarPorId(): Promise<void> {
    console.log('\n--- Consultar Empréstimo por ID ---');
    try {
      const idStr = await question('ID do empréstimo: ');
      const id = parseInt(idStr, 10);
      if (isNaN(id)) throw new Error('ID inválido.');

      const emprestimo = await this.service.buscarPorId(id);
      printInfo('Empréstimo encontrado:');
      console.log(emprestimo.toString());
    } catch (error) {
      printErro((error as Error).message);
    }
    await pressEnterToContinue();
  }
}
