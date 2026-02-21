const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),

  async execute(interaction) {
    const reply = await interaction.reply({ content: `🏓 Pong! \`${interaction.client.ws.ping}ms\``});

    setTimeout(async () => {
      await interaction.deleteReply().catch(() => {});
    }, 5000);
  }
};

