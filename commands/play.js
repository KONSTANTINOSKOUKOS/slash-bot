const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Παίζει ένα τραγούδι(με όνομα ή link σε playlist) στο voice channel στο οποίο βρίσκεστε')
    .addStringOption(opt => {
      return opt
        .setName('song')
        .setDescription('το τραγούδι που θέλετε να παίξει το bot')
        .setRequired(true);
    }),
  async run(msg) {
    const queue = msg.client.player.createQueue(msg.guildId);
    const id = msg.member.voice.channelId;
    console.log(id)
    if (!id)
      return await msg.editReply('Πρέπει να μπεις σε ένα voice channel πρώτα!')
    await queue.join(id);
    let song = await queue.play(msg.options.getString('song', true)).catch(err => {
      console.log(err);
      if (!guildQueue)
        queue.stop();
    });
  },
};