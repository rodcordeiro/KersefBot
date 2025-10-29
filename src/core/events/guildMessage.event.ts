import { Events, MessageType } from 'discord.js';
import { GuildServices } from '../../services/guild.service';

import { client } from '../discord/client.discord';
client.on(Events.MessageCreate, async message => {
  if (!message.inGuild()) return;
  if (message.type == MessageType.ChatInputCommand) return;
  if (message.type == MessageType.ContextMenuCommand) return;
  await GuildServices.CreateOrUpdate({ id: message.guildId });
});

client.on(Events.MessageUpdate, async message => {
  if (!message.inGuild()) return;
  if (message.type == MessageType.ChatInputCommand) return;
  if (message.type == MessageType.ContextMenuCommand) return;
  // console.log("guild_message::update", message);
});
