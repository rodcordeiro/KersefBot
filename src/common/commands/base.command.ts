import {
  SlashCommandBuilder,
  ContextMenuCommandBuilder,
  ChatInputCommandInteraction,
  ContextMenuCommandInteraction,
} from 'discord.js';

export type BaseCommand = {
  data: SlashCommandBuilder | ContextMenuCommandBuilder;
  execute: (
    _interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction,
  ) => Promise<void>;
  autocomplete?: () => Promise<void>;
  modalHandler?: () => Promise<void>;
};
