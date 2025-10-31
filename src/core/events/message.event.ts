import { Events, MessageType } from 'discord.js';

import { client } from '../discord/client.discord';
import { UserService } from '../../services/user.service';
// import { GuildServices } from '~/src/services/guild.service';

// const _guildService = new GuildServices();
const _userService = new UserService();

client.on(Events.MessageCreate, async message => {
  try {
    if (message.author.bot) return;
    console.log('Message received', {
      discordId: message.author.id,
      guildId: message.guildId,
      name: message.author.username,
      inguild: message.guildId,
      type: message.type,
      content: message.content,
    });

    // await _guildService.CreateOrUpdate({ id: message.guildId ?? '' });
    await _userService.register({
      guildId: message.guildId ?? '',
      userId: message.author.id,
      name: message.author.username,
    });
    await _userService.addXp(message.guildId ?? '', message.author.id);
    // if (message.type == MessageType.ChatInputCommand) return;
    //  if (message.type == MessageType.ContextMenuCommand) return;
    // if (message.guildId) {

    // console.log('guild_message::create', message);
    // await GuildServices.CreateOrUpdate({ id: message.guildId });

    // console.log('private_message::create', message.content);
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
