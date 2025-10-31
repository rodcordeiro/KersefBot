import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  AutocompleteInteraction,
} from 'discord.js';
import { PowerRegisterCommand } from './subcommands/register';
import { actionsMapper } from '../../common/utils/message.util';
import { iBaseCommand } from '../../common/commands/base.command';

export default class PowerCommand {
  data = new SlashCommandBuilder()
    .setName('poder')
    .setDescription('Registrar power level e ver o ranking da guilda')
    .addSubcommand(new PowerRegisterCommand().data);

  async autocomplete(interaction: AutocompleteInteraction) {
    const focusedValue = interaction.options.getFocused(true);
    const filtered: Array<AutocompleteOption> = [];
    console.log({ focusedValue });

    return await interaction.respond(filtered);
  }

  async execute(interaction: ChatInputCommandInteraction) {
    return await actionsMapper(
      [PowerRegisterCommand] as unknown as iBaseCommand[],
      interaction,
    );
  }
}
