import {
  APIEmbedField,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
} from 'discord.js';
import { UserService } from '../../../services/user.service';

const _service = new UserService();

export class PowerRankingCommand {
  data = new SlashCommandSubcommandBuilder()
    .setName('ranking')
    .setDescription('Ver o ranking de power level');

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
      content: 'Processando informações',
    });
    const [first, second, third, ...rest] = await _service.getPowerlevelRanking(
      interaction.guildId ?? '',
    );

    const fields: APIEmbedField[] = [];

    fields.push({
      name: 'Nick',
      value: first.nick,
      inline: true,
    });
    fields.push({
      name: 'Score',
      value: first.score.toString(),
      inline: true,
    });
    fields.push({
      name: `:crossed_swords: Warlord de Kersef`,
      value: '\u200B',
      inline: true,
    });
    fields.push({
      name: 'Nick',
      value: second.nick,
      inline: true,
    });
    fields.push({
      name: 'Score',
      value: second.score.toString(),
      inline: true,
    });
    fields.push({
      name: `:heart_on_fire: Jarl das Chamas`,
      value: '\u200B',
      inline: true,
    });
    fields.push({
      name: 'Nick',
      value: third.nick,
      inline: true,
    });
    fields.push({
      name: 'Score',
      value: third.score.toString(),
      inline: true,
    });
    fields.push({
      name: `:shield: Guardião dos Portões`,
      value: '\u200B',
      inline: true,
    });
    fields.push({
      name: '\u200B',
      value: 'Demais posições:',
      inline: false,
    });
    rest.map((i, idx) => {
      fields.push({
        name: `#${idx + 1} Nick`,
        value: i.nick,
        inline: true,
      });
      fields.push({
        name: 'Score',
        value: i.score.toString(),
        inline: true,
      });
      fields.push({
        name: '\u200B',
        value: '\u200B',
        inline: true,
      });
    });

    const embed = new EmbedBuilder()
      .setColor(Colors.DarkGreen)
      .setTitle(`:fire: Ranking de Poder — Guerreiros de Kersef Hell`)
      .setDescription(
        `As chamas da glória consomem o campo de batalha, e apenas os mais fortes se erguem entre os heróis de Kersef Hell.
Estes são os guerreiros que moldam o destino com poder e honra.
Somente os dignos conquistam seus títulos.`,
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
