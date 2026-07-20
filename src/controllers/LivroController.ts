import { LivroService } from '../services/LivroService';
import { question, pressEnterToContinue } from '../utils/input';
import { printSucesso, printErro, printLista, printInfo } from '../utils/formatter';

export class LivroController {
  private readonly service: LivroService;

  constructor() {
    this.service = new LivroService();
  }

  async cadastrar(): Promise<void> {
    console.log('\n--- Cadastrar Livro ---');
    try {
      const titulo = await question('Título: ');
      const autorIdStr = await question('ID do Autor: ');
      const autor_id = parseInt(autorIdStr, 10);
      if (isNaN(autor_id)) throw new Error('ID do autor inválido.');

      const isbn = await question('ISBN (opcional): ');
      const anoStr = await question('Ano de publicação (opcional): ');
      const ano_publicacao = anoStr ? parseInt(anoStr, 10) : undefined;

      const qtdStr = await question('Quantidade de exemplares: ');
      const quantidade_total = parseInt(qtdStr, 10);
      if (isNaN(quantidade_total)) throw new Error('Quantidade inválida.');

      const livro = await this.service.cadastrar({
        titulo,
        autor_id,
        isbn,
        ano_publicacao,
        quantidade_total,
        quantidade_disponivel: quantidade_total,
      });
      printSucesso(`Livro "${livro.titulo}" cadastrado com sucesso! ID: ${livro.id}`);
    } catch (error) {
      printErro((error as Error).message);
    }
    await pressEnterToContinue();
  }

  async listar(): Promise<void> {
    console.log('\n--- Listar Livros ---');
    try {
      const livros = await this.service.listarTodos();
      printLista(livros);
    } catch (error) {
      printErro((error as Error).message);
    }
    await pressEnterToContinue();
  }

  async buscarPorId(): Promise<void> {
    console.log('\n--- Consultar Livro por ID ---');
    try {
      const idStr = await question('ID do livro: ');
      const id = parseInt(idStr, 10);
      if (isNaN(id)) throw new Error('ID inválido.');

      const livro = await this.service.buscarPorId(id);
      printInfo('Livro encontrado:');
      console.log(livro.toString());
    } catch (error) {
      printErro((error as Error).message);
    }
    await pressEnterToContinue();
  }

  async atualizar(): Promise<void> {
    console.log('\n--- Atualizar Livro ---');
    try {
      const idStr = await question('ID do livro a atualizar: ');
      const id = parseInt(idStr, 10);
      if (isNaN(id)) throw new Error('ID inválido.');

      const livroAtual = await this.service.buscarPorId(id);
      console.log(`\nDados atuais: ${livroAtual.toString()}`);
      console.log('(Deixe em branco para manter o valor atual)\n');

      const titulo = await question(`Título [${livroAtual.titulo}]: `);
      const autorIdStr = await question(`ID do Autor [${livroAtual.autor_id}]: `);
      const isbn = await question(`ISBN [${livroAtual.isbn || ''}]: `);
      const anoStr = await question(`Ano [${livroAtual.ano_publicacao || ''}]: `);
      const qtdStr = await question(`Quantidade total [${livroAtual.quantidade_total}]: `);

      const atualizado = await this.service.atualizar(id, {
        titulo: titulo || livroAtual.titulo,
        autor_id: autorIdStr ? parseInt(autorIdStr, 10) : livroAtual.autor_id,
        isbn: isbn || livroAtual.isbn,
        ano_publicacao: anoStr ? parseInt(anoStr, 10) : livroAtual.ano_publicacao,
        quantidade_total: qtdStr ? parseInt(qtdStr, 10) : livroAtual.quantidade_total,
        quantidade_disponivel: livroAtual.quantidade_disponivel,
      });
      printSucesso(`Livro "${atualizado.titulo}" atualizado com sucesso!`);
    } catch (error) {
      printErro((error as Error).message);
    }
    await pressEnterToContinue();
  }

  async remover(): Promise<void> {
    console.log('\n--- Remover Livro ---');
    try {
      const idStr = await question('ID do livro a remover: ');
      const id = parseInt(idStr, 10);
      if (isNaN(id)) throw new Error('ID inválido.');

      const livro = await this.service.buscarPorId(id);
      const confirmacao = await question(
        `Tem certeza que deseja remover "${livro.titulo}"? (s/N): `
      );
      if (confirmacao.toLowerCase() !== 's') {
        printInfo('Operação cancelada.');
      } else {
        await this.service.remover(id);
        printSucesso(`Livro "${livro.titulo}" removido com sucesso!`);
      }
    } catch (error) {
      printErro((error as Error).message);
    }
    await pressEnterToContinue();
  }
}
