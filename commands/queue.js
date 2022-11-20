const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Απαντά με τα τραγούδια της λίστας'),
  async run(msg) {
    const queue = msg.client.player.getQueue(msg.guild);
    if (msg.client.playlist.length == 0) return await msg.editReply('Δεν υπάρχουν τραγούδια στην λίστα');
    const list = [];
    msg.client.playlist.forEach((song) => list.push(`${song.title}\n`));
    return await msg.editReply(list.join(''));
  },
};