const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const spotify = require('../../../utils/spotify');

module.exports = {
    name: 'spotify-unlink',
    description: 'Unlink your Spotify account',
    data: new SlashCommandBuilder()
        .setName('spotify-unlink')
        .setDescription('Disconnect your Spotify account from Vachrom'),
    async execute(interaction) {
        if (!spotify.isAccountLinked(interaction.user.id)) {
            return interaction.reply({ content: 'Your Spotify account is not linked.', ephemeral: true });
        }

        await spotify.unlinkAccount(interaction.user.id);

        const embed = new EmbedBuilder()
            .setColor('#1DB954')
            .setTitle('✅ Spotify Account Unlinked')
            .setDescription('Your Spotify account has been successfully disconnected from Vachrom.')
            .setTimestamp();

        interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
