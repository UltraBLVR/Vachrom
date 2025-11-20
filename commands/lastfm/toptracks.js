const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const lastfm = require('../../utils/lastfm');

module.exports = {
    name: 'toptracks',
    description: 'Show your top tracks on Last.fm',
    data: new SlashCommandBuilder()
        .setName('toptracks')
        .setDescription('Show your top tracks on Last.fm')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Last.fm username (defaults to your profile)')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('period')
                .setDescription('Time period for top tracks')
                .addChoices(
                    { name: 'Overall', value: 'overall' },
                    { name: '12 Months', value: '12month' },
                    { name: '6 Months', value: '6month' },
                    { name: '3 Months', value: '3month' },
                    { name: '1 Month', value: '1month' },
                    { name: '1 Week', value: '7day' }
                )
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
        const period = interaction.options.getString('period') || 'overall';
        const limit = interaction.options.getInteger('limit') || 10;

        await interaction.deferReply();

        const tracks = await lastfm.getTopTracks(username, period, limit);

        if (!tracks || tracks.length === 0) {
            return interaction.editReply(`No top tracks found for ${username}`);
        }

        const periodLabel = {
            'overall': 'All Time',
            '12month': 'Last 12 Months',
            '6month': 'Last 6 Months',
            '3month': 'Last 3 Months',
            '1month': 'Last Month',
            '7day': 'Last Week'
        };

        const embed = new EmbedBuilder()
            .setColor('#d51007')
            .setTitle(`${username}'s Top Tracks - ${periodLabel[period]}`)
            .setDescription(tracks.map((track, index) => {
                return `**${index + 1}.** [${track.name}](${track.url}) - ${track.artist}\n_${track.playCount.toLocaleString()} plays_`;
            }).join('\n'))
            .setTimestamp();

        interaction.editReply({ embeds: [embed] });
    }
};
