import { ClienteService } from '../services/ClienteService';
import { question, pressEnterToContinue } from '../utils/input';
import { printSucesso, printErro, printLista, printInfo } from '../utils/formatter';

export class ClienteController {
  private readonly service: ClienteService;

  constructor() {
    this.service = new ClienteService();
  }

  async cadastrar(): Promise<void> {
    console.log('\n--- Cadastrar Cliente ---');
    try {
      const nome = await question('Nome: ');
      const email = await question('E-mail: ');
      const telefone = await question('Telefone (opcional): ');

      const cliente = await this.service.cadastrar({ nome, email, telefone });
      printSucesso(`Cliente "${cliente.nome}" cadastrado com sucesso! ID: ${cliente.id}`);
    } catch (error) {
      printErro((error as Error).message);
    }
    await pressEnterToContinue();
  }

  async listar(): Promise<void> {
    console.log('\n--- Listar Clientes ---');
    try {
      const clientes = await this.service.listarTodos();
      printLista(clientes);
    } catch (error) {
      printErro((error as Error).message);
    }
    await pressEnterToContinue();
  }

  async buscarPorId(): Promise<void> {
    console.log('\n--- Consultar Cliente por ID ---');
    try {
      const idStr = await question('ID do cliente: ');
      const id = parseInt(idStr, 10);
      if (isNaN(id)) throw new Error('ID inválido.');

      const cliente = await this.service.buscarPorId(id);
      printInfo('Cliente encontrado:');
      console.log(cliente.toString());
    } catch (error) {
      printErro((error as Error).message);
    }
    await pressEnterToContinue();
  }

  async atualizar(): Promise<void> {
    console.log('\n--- Atualizar Cliente ---');
    try {
      const idStr = await question('ID do cliente a atualizar: ');
      const id = parseInt(idStr, 10);
      if (isNaN(id)) throw new Error('ID inválido.');

      const clienteAtual = await this.service.buscarPorId(id);
      console.log(`\nDados atuais: ${clienteAtual.toString()}`);
      console.log('(Deixe em branco para manter o valor atual)\n');

      const nome = await question(`Nome [${clienteAtual.nome}]: `);
      const email = await question(`E-mail [${clienteAtual.email}]: `);
      const telefone = await question(`Telefone [${clienteAtual.telefone || ''}]: `);

      const atualizado = await this.service.atualizar(id, {
        nome: nome || clienteAtual.nome,
        email: email || clienteAtual.email,
        telefone: telefone || clienteAtual.telefone,
      });
      printSucesso(`Cliente "${atualizado.nome}" atualizado com sucesso!`);
    } catch (error) {
      printErro((error as Error).message);
    }
    await pressEnterToContinue();
  }

  async remover(): Promise<void> {
    console.log('\n--- Remover Cliente ---');
    try {
      const idStr = await question('ID do cliente a remover: ');
      const id = parseInt(idStr, 10);
      if (isNaN(id)) throw new Error('ID inválido.');

      const cliente = await this.service.buscarPorId(id);
      const confirmacao = await question(
        `Tem certeza que deseja remover "${cliente.nome}"? (s/N): `
      );
      if (confirmacao.toLowerCase() !== 's') {
        printInfo('Operação cancelada.');
      } else {
        await this.service.remover(id);
        printSucesso(`Cliente "${cliente.nome}" removido com sucesso!`);
      }
    } catch (error) {
      printErro((error as Error).message);
    }
    await pressEnterToContinue();
  }
}
