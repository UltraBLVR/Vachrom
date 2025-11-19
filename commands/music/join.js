const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    name: 'join',
    description: 'Join your voice channel',
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Join your voice channel'),
    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply('You need to be in a voice channel first!');
        }

        try {
            joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            interaction.reply(`🔊 Joined ${voiceChannel.name}!`);
        } catch (error) {
            console.error(error);
            interaction.reply('Failed to join the voice channel!');
        }
    }
};