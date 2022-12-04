const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Αφαιρεί από την λίστα το τραγούδι που ορίσατε')
    .addNumberOption(opt => {
      return opt.setName('number')
        .setDescription('O αριθμός του τραγουδιού που θέλετε να αφαιρέσετε')
        .setRequired(true);
    }),
  async run(msg) {
    const i = msg.options.getNumber('number', true);
    const song = msg.client.playlist[i - 1];
    msg.client.playlist.splice(i - 1, 1);
    return await msg.editReply(`Αφαιρέθηκε από την λίστα το **[${song.title}](${song.url})**`);
  },
};