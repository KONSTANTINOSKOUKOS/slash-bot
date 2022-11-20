const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('Προσθέτει τραγούδια στην λίστα (εάν είναι το πρώτο θα παίξει στο voice channel στο οποίο βρίσκεστε)')
    .addStringOption(opt => {
      return opt
        .setName('song')
        .setDescription('το τραγούδι που θέλετε να παίξει το bot')
        .setRequired(true);
    }),
  async run(msg) {
    const id = msg.member.voice.channelId;
    if (!id)
      return await msg.editReply('Πρέπει να μπεις σε ένα voice channel πρώτα!');

    let queue = msg.client.player.getQueue(msg.guild);
    if (!queue) {
      queue = msg.client.player.createQueue(msg.guild, {
        metadata: {
          channel: msg.channel
        }
      });
      console.log('new queue!!!!!!');
    } else {
      console.log('old queue!!!!!!');
    }
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

    msg.client.playlist.push(song);
    if (!queue.playing) {
      queue.play(song);
      msg.client.now = song;
    }
    return await msg.editReply(`${!queue.playing ? 'Τώρα παίζει' : 'Προστέθηκε στην λίστα το'} **[${song.title}](${song.url})**`);
  },
};