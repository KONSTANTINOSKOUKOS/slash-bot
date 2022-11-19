const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Απαντά με τα τραγούδια της λίστας'),
  async run(msg) {
    const queue = msg.client.player.getQueue(msg.guild);
    console.log(queue.tracks);
    const list = [];
    queue.tracks.forEach((song) => list.push(`${song.title}\n`));
    return await msg.editReply(list.join(''));
  },
};