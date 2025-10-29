import { Events, MessageType } from 'discord.js';

import { client } from '../discord/client.discord';
import { GuildServices } from '~/src/services/guild.service';
import { UserServices } from '~/src/services/user.service';

client.on(Events.MessageCreate, async message => {
  try {
    console.log('Message received', {
      discordId: message.author.id,
      guildId: message.guildId,
      name: message.author.username,
      inguild: message.guildId,
      type: message.type,
    }); 
    
    if (message.type == MessageType.ChatInputCommand) return;
    if (message.type == MessageType.ContextMenuCommand) return;
    if (message.guildId) {
      console.log('guild_message::create', message);
      await GuildServices.CreateOrUpdate({ id: message.guildId });
      await UserServices.registerXp({
        discordId: message.author.id,
        guildId: message.guildId,
        name: message.author.username,
      });
      return;
    }
    console.log('private_message::create', message);
  } catch (err) {
    console.error(err);
    return;
  }
});

client.on(Events.MessageUpdate, async message => {
  console.log('private_message::update', {
    discordId: message.author?.id,
    guildId: message.guildId,
    name: message.author?.username,
    inguild: message.inGuild(),
    type: message.type,
  });
  if (message.inGuild()) return;
  if (message.type == MessageType.ChatInputCommand) return;
  if (message.type == MessageType.ContextMenuCommand) return;
  console.log('private_message::update', message);
});
