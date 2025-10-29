import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { UserService } from '../../services/user.service';

const _userService = new UserService();
export default class RankingCommand {
  data = new SlashCommandBuilder()
    .setName('ranking')
    .setDescription('Returns the ranking of the server');
  async execute(interaction: ChatInputCommandInteraction) {
    const leaderboard = await _userService.getLeaderboard(
      interaction.guildId ?? '',
    );
    console.log({ leaderboard });
    await interaction.reply({
      content: JSON.stringify(leaderboard),
      ephemeral: true,
    });
  }
}
