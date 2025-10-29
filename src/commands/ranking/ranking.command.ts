import {
  APIEmbedField,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { UserService } from '../../services/user.service';

const _userService = new UserService();
function trophy(level: number) {
  if (level < 1) return ':first_place:';
  if (level < 2) return ':second_place:';
  if (level < 3) return ':third_place:';
}

export default class RankingCommand {
  data = new SlashCommandBuilder()
    .setName('ranking')
    .setDescription('Returns the ranking of the server');
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
      content: 'Processando',
      flags: 'Ephemeral',
    });

    const leaderboard = (
      await _userService.getLeaderboard(interaction.guildId ?? '')
    ).map(user => {
      user.getLevel();
      return user;
    });
    const fields: APIEmbedField[] = [];

    leaderboard.map((i, idx) => {
      fields.push({
        name: `${trophy(idx)} #${idx + 1}`,
        value: i.name,
        inline: false,
      });
      fields.push({
        name: `\u200B`,
        value: `XP: ${i.level.toString()}`,
        inline: true,
      });
      fields.push({
        name: `\u200B`,
        value: `\u200B`,
      });
    });
    const embed = new EmbedBuilder()
      .setColor(Colors.DarkGreen)
      .setTitle(`Ranking de interações`)
      .setDescription(`Ranking de interações no server`)
      .setAuthor({
        name: 'Kersef',
        iconURL: 'https://rodcordeiro.github.io/shares/img/KERSEF-HELL.png',
      })
      .setThumbnail('https://rodcordeiro.github.io/shares/img/KERSEF-HELL.png')
      .addFields(fields)
      .addFields({ name: '\u200B', value: '\u200B' });

    return await interaction.editReply({
      embeds: [embed],
    });
  }
}
