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
    /*let res = null;
    const string = msg.options.getString('song', true);
    
    if(string.includes('https://www.youtube.com/watch')) {//YT VID
      console.log('yt vid');
      res = await msg.client.player.search(string, {
        requestedBy: msg.user,
        searchEngine: 'YOUTUBE_VIDEO'
      }).then(res => res.tracks[0]);
    } else if(string.includes('https://www.youtube.com/playlist')) {//YT PLAYLIST
      console.log('yt playlist');
      res = await msg.client.player.search(string, {
        requestedBy: msg.user,
        searchEngine: 'YOUTUBE_PlAYLIST'
      }).then(res =>{console.log(res); return res.tracks;});
      
    } else if(string.includes('https://open.spotify.com/track')) {//SPOTIFY SONG
      console.log('spotify song');
      res = await msg.client.player.search(string, {
        requestedBy: msg.user,
        searchEngine: 'SPOTIFY_SONG'
      }).then(res => res.tracks[0]);
    } else if(string.includes('https://open.spotify.com/playlist')) {//SPOTIFY PLAYLIST
      console.log('spotify playlist');
      res = await msg.client.player.search(string, {
        requestedBy: msg.user,
        searchEngine: 'SPOTIFY_PlAYLIST'
      }).then(res => res.tracks);
    } else {
      res = await msg.client.player.search(string, {
        requestedBy: msg.user,
        searchEngine: 'AUTO'
      }).then(res => res.tracks[0]);
    }
    
    if (!res) return await msg.editReply('Δυστυχώς δεν μπόρεσα να βρω αυτό το τραγούδι ή playlist');

    if(Array.isArray(res)) {// PLAYLIST
      console.log(res);
      msg.client.playlist.push(...res);
      if (!queue.playing) {
        const song = res[0];
        queue.play(song);
        msg.client.now = song;
        return await msg.editReply(`Τώρα παίζει **[${song.title}](${song.url})**`);
      }
        return await msg.editReply(`Προστέθηκε στην λίστα το playlist **[${res.title}](${res.url})**`);
    }else {//SONG
      msg.client.playlist.push(res);
      if(!queue.playing) {
         queue.play(res);
        msg.client.now = res;
      }
        return await msg.editReply(`${!queue.playing ? 'Τώρα παίζει' : 'Προστέθηκε στην λίστα το'} **  [${song.title}](${song.url})**`);    
    }*/


    
    /*
    msg.client.playlist.push(song);
    if (!queue.playing) {
      queue.play(song);
      msg.client.now = song;
    }
    return await msg.editReply(`${!queue.playing ? 'Τώρα παίζει' : 'Προστέθηκε στην λίστα το'} **[${song.title}](${song.url})**`);
    */
  },
};