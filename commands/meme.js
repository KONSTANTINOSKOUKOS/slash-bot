const { SlashCommandBuilder } = require('discord.js');
const { request } = require('undici');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Απαντά με ένα τυχαίο meme σε εικόνα ή gif'),
  async run(msg) {
    const { body } = await request('https://meme-api.herokuapp.com/gimme');
    const data = await body.json();
    await msg.editReply(data.url);
  },
};