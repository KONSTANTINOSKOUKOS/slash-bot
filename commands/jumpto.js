const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('jumpto')
    .setDescription('Παίζει το τραγούδι που ορίσατε προσπερνώντας τα προηγούμενα')
    .addNumberOption(opt => {
      return opt.setName('number')
        .setDescription('O αριθμός του τραγουδιού που θέλετε να παίξετε')
        .setRequired(true);
    }),
  async run(msg) {
    const i = msg.options.getNumber('number', true);
    const song = msg.client.playlist[i - 1];
    msg.client.player.getQueue(msg.guild).play(song, { immediate: true });
    msg.client.now = song;
    return await msg.editReply(`Τώρα παίζει **[${song.title}](${song.url})**`);
  },
};