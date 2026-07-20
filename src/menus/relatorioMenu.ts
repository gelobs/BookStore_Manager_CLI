import { EmprestimoRepository } from '../repositories/EmprestimoRepository';
import { question, pressEnterToContinue } from '../utils/input';
import { printHeader, printErro, printRelatorio } from '../utils/formatter';

const repository = new EmprestimoRepository();

async function relatorioLivrosDisponiveis(): Promise<void> {
  try {
    const dados = await repository.relatorioLivrosDisponiveis();
    const linhas = dados.map((d) => [
      d.titulo,
      d.autor,
      String(d.disponiveis),
      String(d.total),
    ]);
    printRelatorio(
      'Livros Disponíveis',
      ['Título', 'Autor', 'Disponíveis', 'Total'],
      linhas
    );
  } catch (error) {
    printErro((error as Error).message);
  }
  await pressEnterToContinue();
}

async function relatorioLivrosEmprestados(): Promise<void> {
  try {
    const dados = await repository.relatorioLivrosEmprestados();
    const linhas = dados.map((d) => [
      d.titulo,
      d.autor,
      String(d.emprestimos_ativos),
    ]);
    printRelatorio(
      'Livros Atualmente Emprestados',
      ['Título', 'Autor', 'Empréstimos Ativos'],
      linhas
    );
  } catch (error) {
    printErro((error as Error).message);
  }
  await pressEnterToContinue();
}

async function relatorioLivrosPorAutor(): Promise<void> {
  try {
    const dados = await repository.relatorioLivrosPorAutor();
    const linhas = dados.map((d) => [d.autor, String(d.total_livros)]);
    printRelatorio(
      'Livros Cadastrados por Autor',
      ['Autor', 'Total de Livros'],
      linhas
    );
  } catch (error) {
    printErro((error as Error).message);
  }
  await pressEnterToContinue();
}

async function relatorioEmprestimosPorLivro(): Promise<void> {
  try {
    const dados = await repository.relatorioEmprestimosPorLivro();
    const linhas = dados.map((d) => [d.titulo, String(d.total_emprestimos)]);
    printRelatorio(
      'Quantidade de Empréstimos por Livro (Top 10)',
      ['Título', 'Total de Empréstimos'],
      linhas
    );
  } catch (error) {
    printErro((error as Error).message);
  }
  await pressEnterToContinue();
}

async function relatorioClientesComEmprestimosAtivos(): Promise<void> {
  try {
    const dados = await repository.relatorioClientesComEmprestimosAtivos();
    const linhas = dados.map((d) => [
      d.cliente,
      d.email,
      String(d.emprestimos_ativos),
    ]);
    printRelatorio(
      'Clientes com Empréstimos Ativos',
      ['Cliente', 'E-mail', 'Empréstimos Ativos'],
      linhas
    );
  } catch (error) {
    printErro((error as Error).message);
  }
  await pressEnterToContinue();
}

export async function exibirMenuRelatorios(): Promise<void> {
  let ativo = true;

  while (ativo) {
    printHeader('Relatórios');
    console.log('1. Livros disponíveis');
    console.log('2. Livros emprestados');
    console.log('3. Livros cadastrados por autor');
    console.log('4. Quantidade de empréstimos por livro (Top 10)');
    console.log('5. Clientes com empréstimos ativos');
    console.log('0. Voltar ao menu principal');

    const opcao = await question('\nEscolha uma opção: ');

    switch (opcao) {
      case '1':
        await relatorioLivrosDisponiveis();
        break;
      case '2':
        await relatorioLivrosEmprestados();
        break;
      case '3':
        await relatorioLivrosPorAutor();
        break;
      case '4':
        await relatorioEmprestimosPorLivro();
        break;
      case '5':
        await relatorioClientesComEmprestimosAtivos();
        break;
      case '0':
        ativo = false;
        break;
      default:
        printErro('Opção inválida. Tente novamente.');
    }
  }
}
