import { Events, MessageType } from 'discord.js';
import { GuildServices } from '../../services/guild.service';

import { client } from '../discord/client.discord';
import { UserServices } from '~/src/services/user.service';

client.on(Events.MessageCreate, async message => {
  console.log('aqui', {
    discordId: message.author.id,
    guildId: message.guildId,
    name: message.author.username,
    inguild: message.inGuild(),
    type: message.type,
  });
  if (!message.inGuild()) return;
  if (message.type == MessageType.ChatInputCommand) return;
  if (message.type == MessageType.ContextMenuCommand) return;

  await GuildServices.CreateOrUpdate({ id: message.guildId });
  await UserServices.registerXp({
    discordId: message.author.id,
    guildId: message.guildId,
    name: message.author.username,
  });
});

client.on(Events.MessageUpdate, async message => {
  console.log('aqui2', {
    discordId: message.author?.id,
    guildId: message.guildId,
    name: message.author?.username,
    inguild: message.inGuild(),
    type: message.type,
  });
  if (!message.inGuild()) return;
  if (message.type == MessageType.ChatInputCommand) return;
  if (message.type == MessageType.ContextMenuCommand) return;

  await GuildServices.CreateOrUpdate({ id: message.guildId });
  await UserServices.registerXp({
    discordId: message.author.id,
    guildId: message.guildId,
    name: message.author.username,
  });
});
