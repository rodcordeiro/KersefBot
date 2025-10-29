import { Collection } from 'discord.js';
import fs from 'fs';
import { client } from '../core/discord/client.discord';
import { RegisterCommands } from './register';
import { BaseCommand } from '../common/commands/base.command';
import { ModalHandlerIdentifier } from 'src/common/interfaces/modalHandler.interface';

(async () => {
  client.commands = new Collection();
  client.modalHandlers = [] as ModalHandlerIdentifier[];
  const commandsDir = fs
    .readdirSync('src/commands')
    .filter(command => !command.endsWith('.ts') && !command.endsWith('.js'));

  const commands = await Promise.all(
    commandsDir.map(async commandDir => {
      try {
        const command: BaseCommand = await import(
          `./${commandDir}/${commandDir}.command`
        ).then(module => new module.default());
        return command;
      } catch (_err) {
        console.log(`Failed to import ${commandDir}`);
        console.error(_err);
      }
    }),
  ).then(commands =>
    commands.filter(command => {
      if (command) return command;
    }),
  );
  commands.filter(Boolean).map(command => {
    client.commands?.set(command?.data.name as string, command);
  });
  RegisterCommands();
})();
