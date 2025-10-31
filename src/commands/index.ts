import { Collection } from 'discord.js';
import fs from 'fs';
import { client } from '../core/discord/client.discord';
import { RegisterCommands } from './register';
import { BaseCommand, BaseCommandType } from '../common/commands/base.command';
import { ModalHandlerIdentifier } from '../common/interfaces/modalHandler.interface';
import path from 'path';

(async () => {
  client.commands = new Collection();
  client.modalHandlers = [] as ModalHandlerIdentifier[];

  const commandsPath = path.join(__dirname);
  const commandsDir = fs
    .readdirSync(commandsPath)
    .filter(command => !command.includes('.ts') && !command.includes('.js'));

  const commands = await Promise.all(
    commandsDir.map(async commandDir => {
      try {
        const commandPath = path.join(
          commandsPath,
          commandDir,
          `${commandDir}.command`,
        );

        const command: BaseCommand = await import(commandPath).then(
          module => new module.default(),
        );
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
    client.commands?.set(
      command?.data.name as string,
      command as BaseCommandType,
    );
  });
  RegisterCommands();
})();
