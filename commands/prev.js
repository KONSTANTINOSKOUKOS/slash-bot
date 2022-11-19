const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('prev')
    .setDescription('Παίζει το προηγούμενο τραγούδι'),
  async run(msg) {
    const queue = msg.client.player.getQueue(msg.guild);
    queue.back();
    return await msg.editReply(`Τώρα παίζει **[${queue.nowPlaying().title}](${queue.nowPlaying().url})**`);
  },
};