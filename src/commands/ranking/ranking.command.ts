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
        inline: true,
      });
      fields.push({
        name: `\u200B`,
        value: `XP: ${i.level.toString()}`,
        inline: true,
      });
      fields.push({
        name: `\u200B`,
        value: `\u200B`,
        inline: true,
      });
    });
    const embed = new EmbedBuilder()
      .setColor(Colors.DarkGreen)
      .setTitle(`:fire: Ranking de Influência — Vozes de Kersef Hell`)
      .setDescription(
        `Nos salões ecoam as vozes que mantêm viva a chama da irmandade.
Estes são os mensageiros, bardos e líderes cuja presença molda o espírito da guilda.
A influência não vem da força — mas das palavras que unem Kersef Hell.`,
      )
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
