import { exibirMenuAutores } from './autorMenu';
import { exibirMenuLivros } from './livroMenu';
import { exibirMenuClientes } from './clienteMenu';
import { exibirMenuEmprestimos } from './emprestimoMenu';
import { exibirMenuRelatorios } from './relatorioMenu';
import { question } from '../utils/input';
import { encerrarAplicacao } from '../utils/input';
import { printHeader, printErro } from '../utils/formatter';

export async function exibirMenuPrincipal(): Promise<void> {
  let ativo = true;

  while (ativo) {
    printHeader('Bookstore Manager CLI');
    console.log('1. Autores');
    console.log('2. Livros');
    console.log('3. Clientes');
    console.log('4. Empréstimos');
    console.log('5. Relatórios');
    console.log('0. Encerrar aplicação');

    const opcao = await question('\nEscolha uma opção: ');

    switch (opcao) {
      case '1':
        await exibirMenuAutores();
        break;
      case '2':
        await exibirMenuLivros();
        break;
      case '3':
        await exibirMenuClientes();
        break;
      case '4':
        await exibirMenuEmprestimos();
        break;
      case '5':
        await exibirMenuRelatorios();
        break;
      case '0':
        ativo = false;
        encerrarAplicacao();
        break;
      default:
        printErro('Opção inválida. Tente novamente.');
    }
  }
}