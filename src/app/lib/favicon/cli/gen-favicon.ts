import { Command } from 'commander';
import { genFavicon } from '../favicon';

interface OptionT {
  input: string;
  output: string;
}

async function main() {
  const program = new Command();
  program
    .description(`Convert .png into favicon.ico and other related files.`)
    // .showHelpAfterError()
    .allowExcessArguments(false)
    .requiredOption(
      '-i, --input <file>',
      [
        'input .png file to be converted into favicon.ico',
        'i.e. -i "./public/image/community-db-logo.png"',
      ].join('\n')
    )
    .option(
      '-o, --output <dir>',
      ['directory to save the generated icons', 'i.e. -o "./src/app"'].join(
        '\n'
      ),
      false
    );

  program.parse();
  const { input, output } = program.opts<OptionT>();

  await genFavicon(input, output);
}

main();
