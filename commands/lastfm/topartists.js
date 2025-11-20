const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const lastfm = require('../../utils/lastfm');

module.exports = {
    name: 'topartists',
    description: 'Show your top artists on Last.fm',
    data: new SlashCommandBuilder()
        .setName('topartists')
        .setDescription('Show your top artists on Last.fm')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Last.fm username (defaults to your profile)')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('period')
                .setDescription('Time period for top artists')
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
                .setDescription('Number of artists to show (1-50, default 10)')
                .setMinValue(1)
                .setMaxValue(50)
                .setRequired(false)
        ),
    async execute(interaction) {
        const username = interaction.options.getString('username') || interaction.user.username;
        const period = interaction.options.getString('period') || 'overall';
        const limit = interaction.options.getInteger('limit') || 10;

        await interaction.deferReply();

        const artists = await lastfm.getTopArtists(username, period, limit);

        if (!artists || artists.length === 0) {
            return interaction.editReply(`No top artists found for ${username}`);
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
            .setTitle(`${username}'s Top Artists - ${periodLabel[period]}`)
            .setDescription(artists.map((artist, index) => {
                return `**${index + 1}.** [${artist.name}](${artist.url})\n_${artist.playCount.toLocaleString()} plays_`;
            }).join('\n'))
            .setTimestamp();

        interaction.editReply({ embeds: [embed] });
    }
};
