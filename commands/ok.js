const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ok')
        .setDescription('says ok'),
    async run(msg) {
        await msg.deferReply();
        await msg.editReply('ok');
    },
};