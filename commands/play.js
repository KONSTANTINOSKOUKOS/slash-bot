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
    const id = msg.member.voice.channelId;
    console.log(id);
    if (!id)
      return await msg.editReply('Πρέπει να μπεις σε ένα voice channel πρώτα!');
    const queue = msg.client.player.createQueue(msg.guild, {
      metadata: {
        channel: msg.channel
      }
    });

    try {
      if (!queue.connection) await queue.connect(msg.member.voice.channel);
    } catch {
      queue.destroy();
      return await msg.editReply('Δυστυχώς δεν μπόρεσα να μπω στο voice channel σου');
    }

    const song = await msg.client.player.search(msg.options.getString('song', true), {
      requestedBy: msg.user
    }).then(res => res.tracks[0]);
    if (!song) return await msg.editReply('Δυστυχώς δεν μπόρεσα να βρω αυτό το τραγούδι στο Youtube ή το Spotify');

    queue.play(song);
    await msg.editReply(`Τώρα παίζει **${queue.nowPlaying().title}**`);
  },
};