import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  ContextMenuCommandBuilder,
  ChatInputCommandInteraction,
  SlashCommandSubcommandsOnlyBuilder,
  AutocompleteInteraction,
  ModalSubmitInteraction,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from 'discord.js';

export type CommandInteractionType =
  | ChatInputCommandInteraction
  | MessageContextMenuCommandInteraction
  | UserContextMenuCommandInteraction;

export type BaseCommandType = {
  data:
    | SlashCommandBuilder
    | SlashCommandSubcommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | ContextMenuCommandBuilder;
  maintenance?: boolean;
  execute: (interaction: CommandInteractionType) => Promise<void>;
  maintenanceActions: (
    interaction: ChatInputCommandInteraction,
  ) => Promise<void>;
  autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
  modalHandler?: (interaction: ModalSubmitInteraction) => Promise<void>;
};
export type iBaseCommand = new () => BaseCommandType;
// MessageContextMenuCommandInteraction
export abstract class BaseCommand {
  data: BaseCommandType['data'];
  subcommands?: BaseCommand[];
  maintenance: boolean;

  constructor(data: BaseCommandType['data'], maintenance = false) {
    this.data = data;
    this.maintenance = maintenance;
  }
  abstract execute(interaction: CommandInteractionType): Promise<void>;
  async maintenanceActions(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
      content: 'Whops. Command under maintenance, try it later',
      ephemeral: true,
    });
  }
}
