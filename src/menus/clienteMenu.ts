import { ClienteController } from '../controllers/ClienteController';
import { question } from '../utils/input';
import { printHeader, printErro } from '../utils/formatter';

const controller = new ClienteController();

export async function exibirMenuClientes(): Promise<void> {
  let ativo = true;

  while (ativo) {
    printHeader('Gerenciamento de Clientes');
    console.log('1. Cadastrar cliente');
    console.log('2. Listar clientes');
    console.log('3. Consultar cliente por ID');
    console.log('4. Atualizar cliente');
    console.log('5. Remover cliente');
    console.log('0. Voltar ao menu principal');

    const opcao = await question('\nEscolha uma opção: ');

    switch (opcao) {
      case '1':
        await controller.cadastrar();
        break;
      case '2':
        await controller.listar();
        break;
      case '3':
        await controller.buscarPorId();
        break;
      case '4':
        await controller.atualizar();
        break;
      case '5':
        await controller.remover();
        break;
      case '0':
        ativo = false;
        break;
      default:
        printErro('Opção inválida. Tente novamente.');
    }
  }
}
