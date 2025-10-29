/* eslint-disable @typescript-eslint/ban-ts-comment  */
import { Events } from 'discord.js';

import { client } from '../discord/client.discord';
import { UserService } from '../../services/user.service';

const _userService = new UserService();

// @ts-ignore
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands?.get(interaction.commandName);
  if (!command || !command.execute) {
    return interaction.reply('Command not found or has no execution routine!');
  }
  try {
    if (interaction.guild?.id) {
      await _userService.register({
        guildId: interaction.guild.id ?? '',
        userId: interaction.user.id,
        name: interaction.user.username,
      });
      await _userService.addXp(interaction.guild.id, interaction.user.id);
    }
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing ${interaction.commandName}`);
    console.error(error);
  }
});
