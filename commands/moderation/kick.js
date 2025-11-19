const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'Kick a member from the server',
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a member from the server')
        .addUserOption(option => option.setName('user').setDescription('User to kick').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for kick')),
    async execute(interaction) {
        if (interaction.isCommand) {
            if (!interaction.member.permissions.has('KickMembers')) {
                return interaction.reply({ content: 'You need kick permissions to use this command!', ephemeral: true });
            }
            
            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason') || 'No reason provided';
            const member = interaction.guild.members.cache.get(user.id);
            
            if (!member) return interaction.reply({ content: 'User not found in this server!', ephemeral: true });
            
            try {
                await member.kick(reason);
                interaction.reply(`${user.tag} has been kicked. Reason: ${reason}`);
            } catch (error) {
                interaction.reply({ content: 'Failed to kick the user!', ephemeral: true });
            }
        } else {
            if (!interaction.member.permissions.has('KickMembers')) {
                return interaction.reply('You need kick permissions to use this command!');
            }
            
            const user = interaction.mentions.users.first();
            if (!user) return interaction.reply('Please mention a user to kick!');
            
            const member = interaction.guild.members.cache.get(user.id);
            if (!member) return interaction.reply('User not found in this server!');
            
            const reason = interaction.slice(1).join(' ') || 'No reason provided';
            
            try {
                await member.kick(reason);
                interaction.reply(`${user.tag} has been kicked. Reason: ${reason}`);
            } catch (error) {
                interaction.reply('Failed to kick the user!');
            }
        }
    }
};