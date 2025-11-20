const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const lastfm = require('../../utils/lastfm');

module.exports = {
    name: 'recenttracks',
    description: 'Show recent tracks from Last.fm',
    data: new SlashCommandBuilder()
        .setName('recenttracks')
        .setDescription('Show recent tracks from Last.fm')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Last.fm username (defaults to your profile)')
                .setRequired(false)
        )
        .addIntegerOption(option =>
            option.setName('limit')
                .setDescription('Number of tracks to show (1-50, default 10)')
                .setMinValue(1)
                .setMaxValue(50)
                .setRequired(false)
        ),
    async execute(interaction) {
        const username = interaction.options.getString('username') || interaction.user.username;
        const limit = interaction.options.getInteger('limit') || 10;

        await interaction.deferReply();

        const tracks = await lastfm.getRecentTracks(username, limit);

        if (!tracks || tracks.length === 0) {
            return interaction.editReply(`No recent tracks found for ${username}`);
        }

        const embed = new EmbedBuilder()
            .setColor('#d51007')
            .setTitle(`${username}'s Recent Tracks`)
            .setDescription(tracks.map((track, index) => {
                const date = track.date ? `<t:${Math.floor(track.date.getTime() / 1000)}:R>` : 'Unknown';
                return `**${index + 1}.** [${track.name}](${track.url}) - ${track.artist}\n_${date}_`;
            }).join('\n'))
            .setTimestamp();

        interaction.editReply({ embeds: [embed] });
    }
};
