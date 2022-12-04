const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('prev')
    .setDescription('Παίζει το προηγούμενο τραγούδι'),
  async run(msg) {
    const queue = msg.client.player.getQueue(msg.guild);
    if (msg.client.playlist.indexOf(msg.client.now) == 0) return await msg.editReply('Δεν υπάρχει προηγούμενο τραγούδι');//if first song
    const song = msg.client.playlist[msg.client.playlist.indexOf(msg.client.now) - 1];
    queue.play(song, { immediate: true });
    msg.client.now = song;
    return await msg.editReply(`Τώρα παίζει **[${song.title}](${song.url})**`);
  },
};