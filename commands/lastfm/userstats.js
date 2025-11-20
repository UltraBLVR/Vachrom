const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const lastfm = require('../../utils/lastfm');

module.exports = {
    name: 'userstats',
    description: 'Show Last.fm user statistics',
    data: new SlashCommandBuilder()
        .setName('userstats')
        .setDescription('Show Last.fm user statistics')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Last.fm username (defaults to your profile)')
                .setRequired(false)
        ),
    async execute(interaction) {
        const username = interaction.options.getString('username') || interaction.user.username;

        await interaction.deferReply();

        const stats = await lastfm.getUserStats(username);

        if (!stats) {
            return interaction.editReply(`Could not find user: ${username}`);
        }

        const embed = new EmbedBuilder()
            .setColor('#d51007')
            .setTitle(`${stats.username}'s Last.fm Stats`)
            .setDescription(`Member since ${stats.registered.toLocaleDateString()}`)
            .addFields(
                { name: 'Total Scrobbles', value: stats.playCount.toLocaleString(), inline: true },
                { name: 'Artists', value: stats.artistCount.toLocaleString(), inline: true },
                { name: 'Tracks', value: stats.trackCount.toLocaleString(), inline: true },
                { name: 'Albums', value: stats.albumCount.toLocaleString(), inline: true }
            )
            .setThumbnail(stats.image)
            .setURL(stats.url)
            .setTimestamp();

        if (stats.realname) {
            embed.setAuthor({ name: stats.realname });
        }

        interaction.editReply({ embeds: [embed] });
    }
};
