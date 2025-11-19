const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: "ping",
    description: "Check bot latency",
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check bot latency'),
    async execute(interaction) {
        if (interaction.isCommand) {
            const sent = Date.now();
            await interaction.reply('🏓 Pong!');
            const latency = Date.now() - sent;
            await interaction.editReply(`🏓 Pong! Latency: ${latency}ms | API: ${Math.round(interaction.client.ws.ping)}ms`);
        } else {
            const sent = Date.now();
            interaction.reply('🏓 Pong!').then(msg => {
                const latency = Date.now() - sent;
                msg.edit(`🏓 Pong! Latency: ${latency}ms | API: ${Math.round(interaction.client.ws.ping)}ms`);
            });
        }
    }
}