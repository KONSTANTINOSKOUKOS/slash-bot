const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('prev')
    .setDescription('Παίζει το προηγούμενο τραγούδι'),
  async run(msg) {
    msg.client.player.getQueue(msg.guild).back();
    return await msg.editReply(`Τώρα παίζει **${msg.client.player.getQueue(msg.guild).nowPlaying().title}**`);
  },
};