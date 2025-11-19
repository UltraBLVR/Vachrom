const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: '8ball',
    description: 'Ask the magic 8-ball a question',
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Ask the magic 8-ball a question')
        .addStringOption(option => option.setName('question').setDescription('Your question').setRequired(true)),
    async execute(interaction) {
        const responses = [
            'Yes', 'No', 'Maybe', 'Definitely', 'Absolutely not',
            'Ask again later', 'I doubt it', 'Very likely', 'Probably',
            'Cannot predict now', 'Signs point to yes', 'Don\'t count on it'
        ];
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        
        if (interaction.isCommand) {
            await interaction.reply(`🎱 ${response}`);
        } else {
            if (!interaction.length) return interaction.reply('Please ask a question!');
            interaction.reply(`🎱 ${response}`);
        }
    }
};