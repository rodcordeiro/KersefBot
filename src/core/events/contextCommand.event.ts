/* eslint-disable @typescript-eslint/ban-ts-comment  */
import { Events } from 'discord.js';

import { client } from '../discord/client.discord';
// @ts-ignore
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isContextMenuCommand()) return;

  const command = client.commands?.get(interaction.commandName);
  if (!command || !command.execute) {
    return interaction.reply('Command not found or has no execution routine!');
  }
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing ${interaction.commandName}`);
    console.error(error);
  }
});
