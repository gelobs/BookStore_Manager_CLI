import { EmprestimoController } from '../controllers/EmprestimoController';
import { question } from '../utils/input';
import { printHeader, printErro } from '../utils/formatter';

const controller = new EmprestimoController();

export async function exibirMenuEmprestimos(): Promise<void> {
  let ativo = true;

  while (ativo) {
    printHeader('Gerenciamento de Empréstimos');
    console.log('1. Realizar empréstimo');
    console.log('2. Registrar devolução');
    console.log('3. Consultar todos os empréstimos');
    console.log('4. Consultar empréstimo por ID');
    console.log('0. Voltar ao menu principal');

    const opcao = await question('\nEscolha uma opção: ');

    switch (opcao) {
      case '1':
        await controller.realizarEmprestimo();
        break;
      case '2':
        await controller.registrarDevolucao();
        break;
      case '3':
        await controller.listar();
        break;
      case '4':
        await controller.buscarPorId();
        break;
      case '0':
        ativo = false;
        break;
      default:
        printErro('Opção inválida. Tente novamente.');
    }
  }
}
