const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Σταματάει την μουσική και βγαίνει από το voice channel'),
  async run(msg) {
    msg.client.player.getQueue(msg.guild).destroy(true);
    msg.client.playlist = [];
    return await msg.editReply('Βγήκα απο το voice channel');
  },
};