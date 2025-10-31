import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import { BaseCommandType } from 'src/common/commands/base.command';
import { ModalHandlerIdentifier } from 'src/common/interfaces/modalHandler.interface';

export const client: {
  commands?: Collection<string, BaseCommandType | undefined>;
  modalHandlers?: ModalHandlerIdentifier[];
} & Client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    8,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel, Partials.Message],
});
