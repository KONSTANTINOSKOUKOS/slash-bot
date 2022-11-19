const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('next')
    .setDescription('Παίζει το επόμενο τραγούδι στην λίστα'),
  async run(msg) {
    const queue = msg.client.player.getQueue(msg.guild);
    queue.next();
    return await msg.editReply(`Τώρα παίζει **[${queue.nowPlaying().title}](${queue.nowPlaying().url})**`);
  },
};