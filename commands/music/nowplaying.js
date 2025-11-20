const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const spotify = require('../../utils/spotify');

module.exports = {
    name: 'nowplaying',
    description: 'Show yourcurrent track on Spotify',
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Show what you\'re currently playing on Spotify'),
    async execute(interaction) {
        await interaction.deferReply();

        if (!spotify.isAccountLinked(interaction.user.id)) {
            return interaction.editReply('Your Spotify account is not linked. Use `/spotify-link` to connect your account.');
        }

        const nowPlaying = await spotify.getCurrentlyPlaying(interaction.user.id);

        if (!nowPlaying) {
            return interaction.editReply('You are not currently playing anything on Spotify.');
        }

        const progressBar = createProgressBar(nowPlaying.progress, nowPlaying.duration);
        const durationText = formatDuration(nowPlaying.duration);
        const progressText = formatDuration(nowPlaying.progress);

        const embed = new EmbedBuilder()
            .setColor('#1DB954')
            .setTitle('🎵 Now Playing')
            .setDescription(`**${nowPlaying.name}**`)
            .addFields(
                { name: 'Artist', value: nowPlaying.artist, inline: true },
                { name: 'Album', value: nowPlaying.album, inline: true },
                { name: 'Status', value: nowPlaying.isPlaying ? '▶️ Playing' : '⏸️ Paused', inline: true },
                { name: 'Progress', value: `${progressText} / ${durationText}\n${progressBar}`, inline: false }
            )
            .setThumbnail(nowPlaying.image)
            .setURL(nowPlaying.url);

        if (nowPlaying.explicit) {
            embed.addFields({ name: 'Explicit', value: '🔞 Yes', inline: true });
        }

        interaction.editReply({ embeds: [embed] });
    }
};

function createProgressBar(current, total, length = 20) {
    const percentage = current / total;
    const filled = Math.round(percentage * length);
    const empty = length - filled;
    return `[${'█'.repeat(filled)}${'░'.repeat(empty)}]`;
}

function formatDuration(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
