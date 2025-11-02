import {
  APIEmbedField,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { UserService } from '../../services/user.service';
import { UserEntity } from '../../database/entities';

const _userService = new UserService();
function trophy(level: number) {
  if (level < 1) return ':first_place:';
  if (level < 2) return ':second_place:';
  if (level < 3) return ':third_place:';
}

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

export default class RankingCommand {
  data = new SlashCommandBuilder()
    .setName('ranking')
    .setDescription('Returns the ranking of the server');
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
      content: 'Processando',
    });

    const leaderboard = await _userService
      .getXpLogsLast7Days(interaction.guildId!)
      .then(logs => {
        console.log({ logs });

        const res = {} as Record<
          string,
          { ammount: number; user?: UserEntity }
        >;
        logs.forEach(log => {
          if (!res[log.userId]) {
            res[log.userId] = {
              ammount: log.amount,
              user: log.user,
            };
            return;
          }
          res[log.userId].ammount += log.amount;
        });
        return res;
      })
      .then(logs =>
        Object.entries(logs)
          .sort((a, b) => b[1].ammount - a[1].ammount)
          .map(([_userId, data]) => data)
          .filter(Boolean)
          .filter(log => !!log.user),
      )
      .then(logs =>
        logs.map(log => {
          log.user?.getLevel();
          return log;
        }),
      );

    const fields: APIEmbedField[] = [];

    leaderboard.map((i, idx) => {
      fields.push({
        name: `${trophy(idx)} #${idx + 1}`,
        value: i.user!.name.toString(),
        inline: true,
      });
      fields.push({
        name: `\u200B`,
        value: `XP: ${formatWydNumber(i.ammount)}`,
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
      .setFooter({
        text: 'Importante lembrar que este ranking é com base no xp ganho nos últimos 7 dias',
      })
      .setThumbnail('https://rodcordeiro.github.io/shares/img/KERSEF-HELL.png')
      .addFields(fields)
      .addFields({ name: '\u200B', value: '\u200B' });

    return await interaction.editReply({
      embeds: [embed],
    });
  }
}
