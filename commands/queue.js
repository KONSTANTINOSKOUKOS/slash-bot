const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Απαντά με τα τραγούδια της λίστας'),
  async run(msg) {
    await msg.editReply(`queue`);
  },
};