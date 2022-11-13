const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Ξαναξεκινάει την μουσική'),
  async run(msg) {
    msg.client.player.getQueue(msg.guild).setPaused(false);
    return await msg.editReply('Η μουσική ξαναξεκίνησε');
  },
};