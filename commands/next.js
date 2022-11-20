const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('next')
    .setDescription('Παίζει το επόμενο τραγούδι στην λίστα'),
  async run(msg) {
    const queue = msg.client.player.getQueue(msg.guild);
    if (msg.client.playlist.length - 1 == msg.client.playlist.indexOf(msg.client.now)) return await msg.editReply('Δεν υπάρχει επόμενο τραγούδι');//if last song
    const song = msg.client.playlist[msg.client.playlist.indexOf(msg.client.now) + 1];
    queue.play(song,{immediate: true });
    msg.client.now = song;
    return await msg.editReply(`Τώρα παίζει **[${song.title}](${song.url})**`);
  },
};