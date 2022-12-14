const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const wa = require('wolfram-alpha-node')(process.env.appid);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('question')
    .setDescription('Απαντά σε οποιαδήποτε ερώτηση μέσω του Wolfram Alpha')
    .addStringOption(opt => {
      return opt.setName('question')
        .setDescription('Η ερώτηση στην οποία θέλετε να απαντήσει το bot')
        .setRequired(true);
    }),
  async run(msg) {
    try {
      const res = await wa.getShort(msg.options.getString('question', true));
      console.log(res);

      const embed = new EmbedBuilder()
        .setColor(0x404EED)
        .setTitle(msg.options.getString('question', true))
        .setDescription(res);

      await msg.editReply({ embeds: [embed] });
    } catch (e) {
      console.log(e);
      if (e == 'Error: Wolfram|Alpha did not understand your input' || e == 'Error: No short answer available')
        await msg.editReply('Δεν μπόρεσα να καταλάβω την ερώτησή σου');
    }
  },
};