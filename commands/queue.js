const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,ComponentType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Απαντά με τα τραγούδια της λίστας'),
  async run(msg) {
    const queue = msg.client.player.getQueue(msg.guild);
    if (msg.client.playlist.length == 0) return await msg.editReply('Δεν υπάρχουν τραγούδια στην λίστα');
    
    const makelistembed = () => {
    let list = [];
    msg.client.playlist.forEach((song) => {
      const playing = song == msg.client.now; 
      list.push(`${playing ? `:arrow_forward:__[${song.title}](${song.url})__` : `[${song.title}](${song.url})`}\n`);
    });
    return new EmbedBuilder()
      .setColor(0x404EED)
      .setDescription(`**${list.join('')}**`);
    }

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('left')
          .setLabel('◀️')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('right')
          .setLabel('▶️')
          .setStyle(ButtonStyle.Secondary));
        
    const coll = msg.channel.createMessageComponentCollector({ componentType: ComponentType.Button, max:100});
    coll.on('end',is=>{console.log(is)});
    
// coll.on('collect', async i => {
//   await i.deferUpdate();
//   switch(i.customId) {
//     case 'left':
//       if (msg.client.playlist.indexOf(msg.client.now) == 0) return await msg.reply('Δεν υπάρχει προηγούμενο τραγούδι');//if first song
//       const lsong = msg.client.playlist[msg.client.playlist.indexOf(msg.client.now) - 1];
//       return await i.editReply({ embeds: [makelistembed()], components: [row] });
//     return;
//     case 'right':
//       if (msg.client.playlist.length - 1 == msg.client.playlist.indexOf(msg.client.now)) return await msg.reply('Δεν υπάρχει επόμενο τραγούδι');//if last song
//       const rsong = msg.client.playlist[msg.client.playlist.indexOf(msg.client.now) + 1];
//       return await i.editReply({ embeds: [makelistembed()], components: [row] });
//     return;
//   }
// });
    
    return await msg.editReply({ embeds: [makelistembed()], components: [row] });
  },
};