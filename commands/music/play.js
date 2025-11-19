const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const play = require('play-dl');

module.exports = {
    name: 'play',
    description: 'Play music from YouTube',
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play music from YouTube')
        .addStringOption(option => 
            option.setName('query')
                .setDescription('YouTube URL or search query')
                .setRequired(true)
        ),
    async execute(interaction) {
        const query = interaction.options.getString('query');
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply('You need to be in a voice channel to play music!');
        }

        await interaction.deferReply();

        try {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            let stream;
            if (query.includes('youtube.com') || query.includes('youtu.be')) {
                stream = await play.stream(query);
            } else {
                const searched = await play.search(query, { limit: 1 });
                if (!searched[0]) {
                    return interaction.editReply('No results found!');
                }
                stream = await play.stream(searched[0].url);
            }

            const resource = createAudioResource(stream.stream, {
                inputType: stream.type
            });

            const player = createAudioPlayer();
            player.play(resource);
            connection.subscribe(player);

            player.on(AudioPlayerStatus.Playing, () => {
                interaction.editReply('🎵 Now playing!');
            });

            player.on(AudioPlayerStatus.Idle, () => {
                connection.destroy();
            });

        } catch (error) {
            console.error(error);
            interaction.editReply('An error occurred while trying to play music.');
        }
    }
};