const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Σταματάει την μουσική'),
  async run(msg) {
    console.log('aaaaa\n',msg.guild);
    msg.client.player.getQueue(msg.guild).setPaused(true);
    return await msg.editReply('Η μουσική σταμάτησε');
  },
};