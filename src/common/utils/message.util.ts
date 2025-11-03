import { ChatInputCommandInteraction } from 'discord.js';

import { iBaseCommand, BaseCommandType } from '../commands/base.command';

export function replyMessage(interaction: ChatInputCommandInteraction) {
  if (interaction.replied)
    return interaction.editReply(
      'Whops... Lost myself. Do you mind trying again?',
    );
  return interaction.reply('Whops... Lost myself. Do you mind trying again?');
}

export const actionsMapper = async (
  interactions: iBaseCommand[],
  interaction: ChatInputCommandInteraction,
) =>
  interactions
    .map((Command: iBaseCommand) => new Command() as unknown as BaseCommandType)
    .map(i => ({ name: i.data.name, command: i }))
    ?.find(i => i.name === interaction.options.getSubcommand())
    ?.command?.execute(interaction) ?? replyMessage(interaction);

/**
 * Formats a number using "k", "kk", or "kkk" notation.
 *
 * Examples:
 *  - 999 => "999"
 *  - 1000 => "1k"
 *  - 2500 => "2.5k"
 *  - 1000000 => "1kk"
 *  - 1500000 => "1.5kk"
 *  - 1000000000 => "1kkk"
 */
export function formatWydNumber(num: number): string {
  if (num < 1000) {
    return num.toString();
  } else if (num < 1_000_000) {
    return `${(num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1)}k`;
  } else if (num < 1_000_000_000) {
    return `${(num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1)}kk`;
  } else {
    return `${(num / 1_000_000_000).toFixed(num % 1_000_000_000 === 0 ? 0 : 1)}kkk`;
  }
}
