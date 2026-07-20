import { conectarBancoDados } from './database/connection';
import { exibirMenuPrincipal } from './menus/mainMenu';


async function main(): Promise<void> {
  console.log('\n========================================');
  console.log('  *****  Bookstore Manager CLI  *****');
  console.log('========================================');

  try {
    await conectarBancoDados();
    await exibirMenuPrincipal();
  } catch (error) {
    console.error('\n Erro ao iniciar a aplicação:', (error as Error).message);
    process.exit(1);
  }
}

main();
