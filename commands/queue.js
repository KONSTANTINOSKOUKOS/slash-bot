const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Απαντά με τα τραγούδια της λίστας'),
  async run(msg) {
    const queue = msg.client.player.getQueue(msg.guild);
    if (msg.client.playlist.length == 0) return await msg.editReply('Δεν υπάρχουν τραγούδια στην λίστα');
    const list = [];
    msg.client.playlist.forEach((song) => list.push(`${song == msg.client.now ? ':arrow_forward: ' : ''}${song.title}\n`));
    const embed = new EmbedBuilder()
      .setColor(0x7289DA)
      .setDescription(`**${list.join('')}**`);

    const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('right')
					.setLabel('U+203A')
					.setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
					.setCustomId('left')
					.setLabel('U+2039')
					.setStyle(ButtonStyle.Primary),
			);

    return await msg.editReply({ embeds: [embed], components:[row] });
  },
};