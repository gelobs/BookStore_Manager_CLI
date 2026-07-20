export function printHeader(titulo: string): void {
  const linha = '='.repeat(60);
  console.log('\n' + linha);
  console.log(`  📚 ${titulo}`);
  console.log(linha);
}

export function printSucesso(mensagem: string): void {
  console.log(`\n✅ ${mensagem}`);
}

export function printErro(mensagem: string): void {
  console.log(`\n❌ ${mensagem}`);
}

export function printInfo(mensagem: string): void {
  console.log(`\nℹ️  ${mensagem}`);
}

export function printLista(itens: { toString(): string }[]): void {
  if (itens.length === 0) {
    printInfo('Nenhum registro encontrado.');
    return;
  }
  console.log('');
  const separador = '-'.repeat(60);
  console.log(separador);
  itens.forEach((item) => console.log(item.toString()));
  console.log(separador);
  console.log(`Total: ${itens.length} registro(s)`);
}

export function printRelatorio(
  titulo: string,
  colunas: string[],
  linhas: string[][]
): void {
  printHeader(titulo);
  if (linhas.length === 0) {
    printInfo('Nenhum dado encontrado para este relatório.');
    return;
  }
  const separador = '-'.repeat(80);
  console.log('\n' + colunas.join(' | '));
  console.log(separador);
  linhas.forEach((linha) => console.log(linha.join(' | ')));
  console.log(separador);
  console.log(`Total: ${linhas.length} linha(s)`);
}