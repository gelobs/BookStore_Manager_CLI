import { AutorService } from '../services/AutorService';
import { question, pressEnterToContinue } from '../utils/input';
import { printSucesso, printErro, printLista, printInfo } from '../utils/formatter';

export class AutorController {
  private readonly service: AutorService;

  constructor() {
    this.service = new AutorService();
  }

  async cadastrar(): Promise<void> {
    console.log('\n--- Cadastrar Autor ---');
    try {
      const nome = await question('Nome: ');
      const email = await question('E-mail (opcional): ');
      const nacionalidade = await question('Nacionalidade (opcional): ');

      const autor = await this.service.cadastrar({ nome, email, nacionalidade });
      printSucesso(`Autor "${autor.nome}" cadastrado com sucesso! ID: ${autor.id}`);
    } catch (error) {
      printErro((error as Error).message);
    }
    await pressEnterToContinue();
  }

  async listar(): Promise<void> {
    console.log('\n--- Listar Autores ---');
    try {
      const autores = await this.service.listarTodos();
      printLista(autores);
    } catch (error) {
      printErro((error as Error).message);
    }
    await pressEnterToContinue();
  }

  async buscarPorId(): Promise<void> {
    console.log('\n--- Consultar Autor por ID ---');
    try {
      const idStr = await question('ID do autor: ');
      const id = parseInt(idStr, 10);
      if (isNaN(id)) throw new Error('ID inválido.');

      const autor = await this.service.buscarPorId(id);
      printInfo('Autor encontrado:');
      console.log(autor.toString());
    } catch (error) {
      printErro((error as Error).message);
    }
    await pressEnterToContinue();
  }

  async atualizar(): Promise<void> {
    console.log('\n--- Atualizar Autor ---');
    try {
      const idStr = await question('ID do autor a atualizar: ');
      const id = parseInt(idStr, 10);
      if (isNaN(id)) throw new Error('ID inválido.');

      const autorAtual = await this.service.buscarPorId(id);
      console.log(`\nDados atuais: ${autorAtual.toString()}`);
      console.log('(Deixe em branco para manter o valor atual)\n');

      const nome = await question(`Nome [${autorAtual.nome}]: `);
      const email = await question(`E-mail [${autorAtual.email || ''}]: `);
      const nacionalidade = await question(`Nacionalidade [${autorAtual.nacionalidade || ''}]: `);

      const atualizado = await this.service.atualizar(id, {
        nome: nome || autorAtual.nome,
        email: email || autorAtual.email,
        nacionalidade: nacionalidade || autorAtual.nacionalidade,
      });
      printSucesso(`Autor "${atualizado.nome}" atualizado com sucesso!`);
    } catch (error) {
      printErro((error as Error).message);
    }
    await pressEnterToContinue();
  }

  async remover(): Promise<void> {
    console.log('\n--- Remover Autor ---');
    try {
      const idStr = await question('ID do autor a remover: ');
      const id = parseInt(idStr, 10);
      if (isNaN(id)) throw new Error('ID inválido.');

      const autor = await this.service.buscarPorId(id);
      const confirmacao = await question(
        `Tem certeza que deseja remover "${autor.nome}"? (s/N): `
      );

      if (confirmacao.toLowerCase() !== 's') {
        printInfo('Operação cancelada.');
      } else {
        await this.service.remover(id);
        printSucesso(`Autor "${autor.nome}" removido com sucesso!`);
      }
    } catch (error) {
      printErro((error as Error).message);
    }
    await pressEnterToContinue();
  }
}
