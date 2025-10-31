import {
  ChatInputCommandInteraction,
  Message,
  MessageFlags,
  SlashCommandSubcommandBuilder,
  TextChannel,
  ThreadChannel,
} from 'discord.js';

import fs from 'fs';
import path from 'path';
import {
  OcrService,
  DNweights,
  MGweights,
} from '../../../services/ocr.service';
import { UserService } from '../../../services/user.service';

const _ocrService = new OcrService();
const _userService = new UserService();

export class PowerRegisterCommand {
  data = new SlashCommandSubcommandBuilder()
    .setName('registrar')
    .setDescription('Registrar o power level do personagem')
    .addStringOption(option =>
      option
        .setName('nick')
        .setDescription('Qual o nick do personagem?')
        .setRequired(true),
    )
    .addStringOption(option =>
      option
        .setName('classe')
        .setDescription('Qual a classe do personagem?')
        .setRequired(true)
        .addChoices(
          [Object.keys(DNweights), Object.keys(MGweights)].flat(1).map(i => ({
            name: i,
            value: i,
          })),
        ),
    )
    .addStringOption(option =>
      option
        .setName('foco')
        .setDescription('O seu personagem é focado em **Dano** ou **Magia**?')
        .setRequired(true)
        .addChoices([
          { name: 'Dano', value: 'DN' },
          { name: 'Magia', value: 'MG' },
        ]),
    );

  // Saves an attachment to ./temp/ and returns local path
  async saveAttachmentLocally(attachment: Attachment): Promise<string> {
    const tempDir = path.resolve('./temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    const fileName = `${Date.now()}_${attachment.name}`;
    const filePath = path.join(tempDir, fileName);

    const res = await fetch(attachment.url);
    const buffer = await res.arrayBuffer();
    await fs.promises.writeFile(filePath, Buffer.from(buffer));

    return filePath;
  }

  // Deletes local file
  async deleteLocalFile(filePath: string) {
    try {
      await fs.promises.unlink(filePath);
    } catch (err) {
      console.error(`Error deleting file ${filePath}:`, err);
    }
  }

  /**
   * Processes the collected message and registers the power level.
   */
  async process(
    collected: Collection<string, Message>,
    fields?: Record<string, string>,
  ) {
    const message = collected.first();
    if (!message) return;

    const attachment = message.attachments.first();
    if (!attachment) return;

    const filePath = await this.saveAttachmentLocally(attachment);

    try {
      const stats = await _ocrService.extractStats(filePath);
      const score = await _ocrService.calculateScore(
        stats,
        fields!.classe,
        fields!.foco as 'DN' | 'MG',
      );

      await _userService.registerPowerLevel({
        nick: fields?.nick,
        class: fields?.classe,
        focus: fields?.foco,
        score,
        userId: message.author.id,
        guildId: message.guildId!,
      });

      await message.reply('✅ Power level registrado com sucesso!');
    } catch (err) {
      console.error(err);
      await message.reply('⚠️ Ocorreu um erro ao processar sua imagem.');
    } finally {
      await this.deleteLocalFile(filePath);
    }
  }

  async execute(interaction: ChatInputCommandInteraction) {
    const filter = (m: Message) => m.author.id === interaction.user.id;

    const options =
      interaction.options.data[0].options
        ?.map(option => [option.name, option.value])
        .filter(Boolean) || [];

    const fields = Object.fromEntries(options) as Record<string, string>;

    await interaction.reply({
      content:
        'Iniciando processo de registro. Agora envie o print de seus atributos da aba avançada.',
      flags: MessageFlags.Ephemeral,
    });

    const channel = interaction.channel;
    if (
      !channel ||
      (!channel.isTextBased() && !(channel instanceof ThreadChannel))
    ) {
      await interaction.followUp({
        content: '❌ Não foi possível encontrar um canal de texto válido.',
      });
      return;
    }

    const textChannel = channel as TextChannel | ThreadChannel;
    try {
      const collected = await textChannel.awaitMessages({
        filter,
        max: 1,
        time: 30000,
        errors: ['time'],
      });

      await this.process(collected, fields);
    } catch (err) {
      console.error({ err });
      await interaction.followUp({
        content: '⌛ Tempo esgotado! Tente novamente enviando o comando.',
      });
    }
  }
}
