const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const lastfm = require('../../utils/lastfm');

module.exports = {
    name: 'nowplaying',
    description: 'Show what you\'re currently playing on Last.fm',
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Show what you\'re currently playing on Last.fm')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Last.fm username (defaults to your profile)')
                .setRequired(false)
        ),
    async execute(interaction) {
        const username = interaction.options.getString('username') || interaction.user.username;

        await interaction.deferReply();

        const nowPlaying = await lastfm.getNowPlaying(username);

        if (!nowPlaying) {
            return interaction.editReply(`${username} is not currently playing anything.`);
        }

        const embed = new EmbedBuilder()
            .setColor('#d51007')
            .setTitle('🎵 Now Playing')
            .setDescription(`**${nowPlaying.name}**`)
            .addFields(
                { name: 'Artist', value: nowPlaying.artist, inline: true },
                { name: 'Album', value: nowPlaying.album || 'Unknown', inline: true },
                { name: 'Username', value: username, inline: true }
            )
            .setThumbnail(nowPlaying.image)
            .setURL(nowPlaying.url)
            .setTimestamp();

        interaction.editReply({ embeds: [embed] });
    }
};
