import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer: string) => {
      resolve(answer.trim());
    });
  });
}

export async function pressEnterToContinue(): Promise<void> {
  await question('\nPressione ENTER para continuar...');
}

export function encerrarAplicacao(): void {
  console.log('\nAté logo! 👋\n');
  rl.close();
  process.exit(0);
}