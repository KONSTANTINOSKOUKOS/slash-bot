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
    //////////////////////////////////       QUEUE              ////////////////////////////
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
    }
    ////////////////////////////////            CONNECTION             /////////////////////////
    try {
      if (!queue.connection) await queue.connect(msg.member.voice.channel);
    } catch {
      queue.destroy();
      return await msg.editReply('Δυστυχώς δεν μπόρεσα να μπω στο voice channel σου');
    }
    ///////////////////////////////////             SONG                  /////////////////////
    // const song = await msg.client.player.search(msg.options.getString('song', true), {
    //    requestedBy: msg.user
    //  }).then(res => res.tracks[0]);
    //  if (!song) return await msg.editReply('Δυστυχώς δεν μπόρεσα να βρω αυτό το τραγούδι στο Youtube ή το Spotify');

    //  msg.client.playlist.push(song);
    //  if (!queue.playing) {
    //    queue.play(song);
    //    msg.client.now = song;
    //  }
    //  return await msg.editReply(`${!queue.playing ? 'Τώρα παίζει' : 'Προστέθηκε στην λίστα το'} **[${song.title}](${song.url})**`);

    const string = msg.options.getString('song', true);
    let searchEngine = '';
    let isPlaylist = false;

    if (string.includes('https://youtube.com/watch')) {
      searchEngine = 'YOUTUBE_VIDEO';
    } else if (string.includes('https://youtube.com/playlist')) {
      searchEngine = 'YOUTUBE_PLAYLIST';
    } else if (string.includes('https://open.spotify.com/track')) {
      searchEngine = 'SPOTIFY_SONG';
    } else if (string.includes('https://open.spotify.com/playlist')) {
      searchEngine = 'SPOTIFY_PLAYLIST';
    } else {
      searchEngine = 'AUTO';
    }

    isPlaylist = searchEngine.includes('PLAYLIST');
    console.log(searchEngine,isPlaylist);

    const res = await msg.client.player.search(string, {
      requestedBy: msg.user,
      // searchEngine: searchEngine
    }).then(res => {return isPlaylist ? res.tracks : res.tracks[0] });
    if (!res) return await msg.editReply('Δυστυχώς δεν μπόρεσα να βρω αυτό που ζητάς!');

    console.log(res);
    
    if(isPlaylist) msg.client.playlist.push(...res);
    else msg.client.playlist.push(res);
    const song = isPlaylist ? res[0] : res;

    if (!queue.playing) {
      queue.play(song);
      msg.client.now = song;
    }

    const msgg = !queue.playing ? `Τώρα παίζει **[${song.title}](${song.url})**` : `Προστέθηκε το ${isPlaylist ? `**[${res.title}](${res.url})**` : `**[${song.title}](${song.url})**`}`;
    return await msg.editReply(msgg);

    /////////////////////////////////////////////////////////////////////////////////////////
    // let res = null;
    // const string = msg.options.getString('song', true);

    // if (string.includes('https://www.youtube.com/watch')) {//YT VID
    //   console.log('yt vid');
    //   res = await msg.client.player.search(string, {
    //     requestedBy: msg.user,
    //     searchEngine: 'YOUTUBE_VIDEO'
    //   }).then(res => res.tracks[0]);
    // } else if (string.includes('https://www.youtube.com/playlist')) {//YT PLAYLIST
    //   console.log('yt playlist');
    //   res = await msg.client.player.search(string, {
    //     requestedBy: msg.user,
    //     searchEngine: 'YOUTUBE_PLAYLIST'
    //   }).then(res => { console.log(res); return res.tracks; });

    // } else if (string.includes('https://open.spotify.com/track')) {//SPOTIFY SONG
    //   console.log('spotify song');
    //   res = await msg.client.player.search(string, {
    //     requestedBy: msg.user,
    //     searchEngine: 'SPOTIFY_SONG'
    //   }).then(res => res.tracks[0]);
    // } else if (string.includes('https://open.spotify.com/playlist')) {//SPOTIFY PLAYLIST
    //   console.log('spotify playlist');
    //   res = await msg.client.player.search(string, {
    //     requestedBy: msg.user,
    //     searchEngine: 'SPOTIFY_PLAYLIST'
    //   }).then(res => res.tracks);
    // } else {
    //   res = await msg.client.player.search(string, {
    //     requestedBy: msg.user,
    //     searchEngine: 'AUTO'
    //   }).then(res => res.tracks[0]);
    // }

    // if (!res) return await msg.editReply('Δυστυχώς δεν μπόρεσα να βρω αυτό το τραγούδι ή playlist');

    // if (Array.isArray(res)) {// PLAYLIST
    //   console.log(res);
    //   msg.client.playlist.push(...res);
    //   if (!queue.playing) {
    //     const song = res[0];
    //     queue.play(song);
    //     msg.client.now = song;
    //     return await msg.editReply(`Τώρα παίζει **[${song.title}](${song.url})**`);
    //   }
    //   return await msg.editReply(`Προστέθηκε στην λίστα το playlist **[${res.title}](${res.url})**`);
    // } else {//SONG
    //   msg.client.playlist.push(res);
    //   if (!queue.playing) {
    //     queue.play(res);
    //     msg.client.now = res;
    //   }
    //   return await msg.editReply(`${!queue.playing ? 'Τώρα παίζει' : 'Προστέθηκε στην λίστα το'} **  [${song.title}](${song.url})**`);
    // }
  },
};