const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const spotify = require('../../../utils/spotify');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const statesPath = path.join(__dirname, '../../data/oauth-states.json');

const loadStates = () => {
    if (fs.existsSync(statesPath)) {
        return JSON.parse(fs.readFileSync(statesPath, 'utf-8'));
    }
    return {};
};

const saveStates = (states) => {
    const dataDir = path.dirname(statesPath);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(statesPath, JSON.stringify(states, null, 2));
};

module.exports = {
    name: 'spotify-link',
    description: 'Link your Spotify account',
    data: new SlashCommandBuilder()
        .setName('spotify-link')
        .setDescription('Link your Spotify account to your Discord profile'),
    async execute(interaction) {
        if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
            return interaction.reply('Spotify integration is not configured yet. Please add credentials to .env');
        }

        const state = crypto.randomBytes(16).toString('hex');
        const states = loadStates();
        states[state] = {
            userId: interaction.user.id,
            createdAt: Date.now()
        };
        saveStates(states);

        const authUrl = spotify.getAuthorizationUrl(state);

        const embed = new EmbedBuilder()
            .setColor('#1DB954')
            .setTitle('🎵 Spotify Account Linking')
            .setDescription('Click the button below to authorize Vachrom to access your Spotify account.')
            .addFields(
                { name: 'Permissions', value: '• Current playback status\n• Top tracks & artists\n• Recently played\n• Profile information', inline: false }
            )
            .setFooter({ text: 'This authorization is secure and required only once.' });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Authorize Spotify')
                    .setURL(authUrl)
                    .setStyle(ButtonStyle.Link)
            );

        interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    }
};
