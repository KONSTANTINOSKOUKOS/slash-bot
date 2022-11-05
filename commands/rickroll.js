const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rickroll')
    .setDescription('Απαντά με ένα gif του Rick Astley'),
  async run(msg) {
    await msg.editReply('https://tenor.com/view/rickroll-roll-rick-never-gonna-give-you-up-never-gonna-gif-22954713');
  },
};