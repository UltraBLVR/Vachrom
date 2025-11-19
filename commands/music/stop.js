const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    name: 'stop',
    description: 'Stop music and disconnect from voice channel',
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop music and disconnect from voice channel'),
    async execute(interaction) {
        const connection = getVoiceConnection(interaction.guild.id);
        
        if (!connection) {
            return interaction.reply('Not connected to any voice channel!');
        }

        connection.destroy();
        interaction.reply('🛑 Stopped music and disconnected!');
    }
};