import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  EmbedBuilder,
  UserContextMenuCommandInteraction,
} from 'discord.js';

export default class InfoCommand {
  data = new ContextMenuCommandBuilder()
    .setName('User details')
    .setType(ApplicationCommandType.User);

  async execute(interaction: UserContextMenuCommandInteraction) {
    await interaction.deferReply({
      flags: 'Ephemeral',
    });
    const user = interaction.targetUser;
    const embed = new EmbedBuilder()
      .setTitle(`${user.username} Info:`)
      .setFields([
        {
          name: 'Name',
          value: `_${user.tag}_`,
          inline: true,
        },
        {
          name: 'ID',
          value: `\`#${user.id}\``,
          inline: true,
        },
      ])
      .setThumbnail(user.avatarURL());

    await interaction.editReply({
      embeds: [embed],
    });
  }
}
