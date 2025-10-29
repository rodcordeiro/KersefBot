import { SlashCommandBuilder, ContextMenuCommandBuilder } from 'discord.js';

export type BaseCommand = {
  data: SlashCommandBuilder | ContextMenuCommandBuilder;
  execute: () => Promise<void>;
  autocomplete?: () => Promise<void>;
  modalHandler?: () => Promise<void>;
};
