const { SlashCommandBuilder } = require('discord.js');
const { request } = require('undici');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('joke')
		.setDescription('Απαντά με ένα τυχαίο ανέκδοτο'),
	async run(msg) {
		msg.deferReply({ fetchReply: true });
		const { body } = await request('https://v2.jokeapi.dev/joke/Miscellaneous,Dark,Pun,Spooky,Christmas?blacklistFlags=nsfw,religious');
		const data = await body.json();
		console.log(data);
		return await msg.editReply(data.setup ? `${data.setup}\n${data.delivery}` : data.joke);
	},
};