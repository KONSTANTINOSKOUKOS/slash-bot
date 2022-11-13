const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('next')
    .setDescription('Παίζει το επόμενο τραγούδι στην λίστα'),
  async run(msg) {
    msg.client.player.getQueue(msg.guild).skip();
    return await msg.editReply(`Τώρα παίζει **${msg.client.player.getQueue(msg.guild).nowPlaying().title}**`);
  },
};