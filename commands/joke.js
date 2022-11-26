const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Απαντά με ένα τυχαίο ανέκδοτο'),
  async run(msg) {
    const { body } = await request('https://v2.jokeapi.dev/joke/Miscellaneous,Dark,Pun,Spooky,Christmas?blacklistFlags=nsfw,religious');
    const data = await body.json();
    console.log(data);
    const embed = new EmbedBuilder()
      .setColor(0x7289DA)
      .setTitle(data.setup ? `${data.setup}\n${data.delivery}` : data.joke);

    return await msg.editReply({ embeds: [embed] });
  },
};